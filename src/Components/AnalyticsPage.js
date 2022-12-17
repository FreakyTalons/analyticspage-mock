import React, { useState } from "react";
import Table from "./Table";
import { useSelector, useDispatch } from "react-redux";
import { setMetrics } from "../store/metricsSlice";
import { setFetchable, setReq } from "../store/requestSlice";
import { setMetricsCopy } from "../store/metricsCopySlice";

export default function AnalyticsPage() {
 
  // state management
  const metrics0 = useSelector((state) => state.metrics.value);
  const dispatch = useDispatch();

  const [displayMetrics, setDisplayMetrics] = useState(false);
  const [dragItem, setDragItem] = useState();
  const [tempDates, setTempDates] = useState({startDate:'', endDate:''});

  //drag and drop functionality
  const handleDragStart = (index) => {
    setDragItem(index);
  };

  const handleDragEnter = (index) => {
    const newMetrics = [...metrics0];
    const item = newMetrics[dragItem];
    newMetrics.splice(dragItem, 1);
    newMetrics.splice(index, 0, item);
    setDragItem(index);
    dispatch(setMetrics(newMetrics));
  };

  // constants for conditional rendering
  let dispBlock = { display: "flex" };
  let dispNone = { display: "none" };
  let active = { borderLeft: "solid #136FED 6px" };
  let inactive = { borderLeft: "none" };

  //callback to hide or show metrics panel
  const handleClick = () => {
    setDisplayMetrics((prevValue) => !prevValue);
  };

  //function to make a metric element active or inactive
  const handleToggleClick = (event) => {
    let name = event.target.innerText;
    const newMetrics = [];
    const editorFunction = (metric) => {
      if (metric.name === name) {
        let tempObj = {
          id: metric.id,
          name: name,
          disp: !metric.disp,
        };
        newMetrics.push(tempObj);
      } else {
        let tempObj = { ...metric };
        newMetrics.push(tempObj);
      }
    };
    metrics0.forEach(editorFunction);
    dispatch(setMetrics(newMetrics));
  };

  //function to access input dates from calender
  const handleDateChange = (event) =>
  {
     const {name, value} = event.target;

     setTempDates((prevValue) => {
      return {...prevValue,
      [name]: value}
     })
  }

  //function to set dates in the redux store
  const handleDateSubmit = () =>
  {
    const d = new Date();
    sessionStorage.setItem('currReqTime', d.getTime());
    let t0 = sessionStorage.getItem('lastFetchTime');
    let t1 = sessionStorage.getItem('currReqTime');
    let t2 = sessionStorage.getItem('lastRejectTime');
    if(t1-t0 > 20000 || t2-t1> 1)
        dispatch(setFetchable());
    dispatch(setReq(tempDates));
    dispatch(setMetricsCopy(metrics0));
  }


  const handleApplyChanges = () =>
  {
    dispatch(setMetricsCopy(metrics0));
  }

  return (
    <>
      <p className="page-head1"> Analytics </p>

      <div className="inputs-bar">
        <div className="date-picker">
          <i className="custom-icon fa-solid fa-calendar-days"></i>
          <span>
            <input onChange={handleDateChange} name="startDate" type="date" min="2021-05-01" max="2021-05-31" />
          </span>
          <span>-</span>
          <span>
            <input onChange={handleDateChange} name="endDate" type="date" min={tempDates.startDate} max="2021-05-31" />
          </span>
          <button className="bt-blue" onClick={handleDateSubmit}> Generate Table</button>
        </div>
        <div className="settings-dd" onClick={handleClick}>
          <i className=" custom-icon fa-solid fa-sliders"></i>
          <span>Settings</span>
        </div>
      </div>

      <div
        className="dim-metrics"
        style={displayMetrics ? dispBlock : dispNone}
      >
        <p className="page-head2"> Dimensions and Metrics </p>
        <div className="metrics-tab">
          {metrics0.map((metric, index) => {
            return ( metric.id === 'date' || metric.id === 'app_id'? 
            <button
                className="metrics-bt metric-active"
                key={index}
                name={metric.name}
              >
                {metric.name}
              </button>:
              <button
                draggable
                className="metrics-bt"
                key={index}
                name={metric.name}
                style={metric.disp ? active : inactive}
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onClick={handleToggleClick}
              >
                {metric.name}
              </button>
            );
          })}
        </div>
        <div className="ctrls">
          <span className="close-bt" onClick={handleClick}>
            Close
          </span>
          <button className="bt-blue" onClick={handleApplyChanges}>Apply Changes</button>
        </div>
      </div>

      <Table />
    </>
  );
}
