import React, { useState } from "react";
import { useDispatch, useSelector} from "react-redux";
import { setDispClrFilter } from "../store/clrFilterSlice";
import MultiRangeSlider from "./MultiRangeSlider";


const HeaderCell = ({ column, sorting, sortTable, setSerApp, appNameList, minMax, dispatch, setRange}) => {
  
 
 

    const listing = appNameList.map( (app) => {
        return({app_name:app.app_name, checked:false}) 
       })
  
    //state management
  const [menuDisp, setMenuDisp] = useState(false);
  const [list0, setList0] = useState(listing);
  const [sliderValues, setSliderValues] = useState({min:0, max:0})
  

  //process variables
  let dispFlex = { display: "flex" };
  let dispNone = { display: "none" };
  
  const isDescSort = sorting.column === column.id && sorting.order === "desc";
  const isAscSort = sorting.column === column.id && sorting.order === "asc";

  const handleSliderSubmit = (id) => 
  {
    dispatch(setDispClrFilter());
    setRange({id:id, ...sliderValues});
  }

  const handleCheckboxClick = ({app_name, checked}) =>
  {
    let tempArr = []
    for (let i = 0; i < list0.length; i++) 
    {
        
        if(list0[i].app_name === app_name && checked === false)
            tempArr = [...tempArr,{app_name:list0[i].app_name, checked:true}]

        else if(list0[i].app_name === app_name && checked === true)
            tempArr = [...tempArr,{app_name:list0[i].app_name, checked:false}]

        else
            tempArr = [...tempArr,{app_name:list0[i].app_name, checked:list0[i].checked}]
    }
    setList0(tempArr)
  }

  const handleSubmitClick = () =>
  {
    dispatch(setDispClrFilter());
    setMenuDisp(prevValue => !prevValue);
    let listFin = []
    for(let i=0;i<list0.length;i++)
    {
        if(list0[i].checked === true)
            listFin = [...listFin,list0[i].app_name];
    }
    console.log(listFin);
    setSerApp(listFin);
  }

  const minVal = (id) =>
  {
    for(let i =0; i<minMax.length; i++)
      {
        if(minMax[i].id === id)
          return minMax[i].min;
      }
  }

  const maxVal = (id) =>
  {
    for(let i =0; i<minMax.length; i++)
      {
        if(minMax[i].id === id)
          return minMax[i].max;
      }
  }

  return (
    column.disp && (
      <th className={column.class}>
        <i
          className=" funnel-ico fa-solid fa-filter"
          onClick={() => setMenuDisp((prevValue) => !prevValue)}
        ></i>
        {column.id === "date" ? (
          <div className="filter-dd" style={menuDisp ? dispFlex : dispNone}>
            <div
              className="dd-bt"
              onClick={() => {
                sortTable({ column: column.id, order: "desc" });
                setMenuDisp((prevValue) => !prevValue);
              }}
            >
              Sort: Latest First
            </div>
            <div
              className="dd-bt"
              onClick={() => {
                sortTable({ column: column.id, order: "asc" });
                setMenuDisp((prevValue) => !prevValue);
              }}
            >
              Sort: Oldest First
            </div>
          </div>
        ) : column.id === "app_id" ? (<>
            <div className="filter-dd" style={menuDisp ? dispFlex : dispNone}>
            <div
              className="dd-bt"
              onClick={() => {
                sortTable({ column: column.id, order: "desc" });
                setMenuDisp((prevValue) => !prevValue);
              }}
            >
              Sort: A to Z
            </div>
            <div
              className="dd-bt"
              onClick={() => {
                sortTable({ column: column.id, order: "asc" });
                setMenuDisp((prevValue) => !prevValue);
              }}
            >
              Sort: Z to A
            </div>
            <div className="dd-bt">Select App</div>
              <ul>
                {list0.map((app, index) => 
                    <li key={index}>
                        <input type='checkbox' id={app.app_name} name={app.app_name} value={app.app_name} checked={app.checked} onChange={() => handleCheckboxClick(app)}/>
                        <label htmlFor={app.app_name}>{app.app_name}</label>
                    </li>
                )}
              </ul>
              <button style={{margin:"10px auto"}} className="bt-blue" onClick={handleSubmitClick}>Apply</button>
          </div>
        </>
          
        ) : (
          <div className="filter-dd" style={menuDisp ? dispFlex : dispNone}>
            <div
              className="dd-bt"
              onClick={() => {
                sortTable({ column: column.id, order: "desc" });
                setMenuDisp((prevValue) => !prevValue);
              }}
            >
              Sort: Highest First
            </div>
            <div
              className="dd-bt"
              onClick={() => {
                sortTable({ column: column.id, order: "asc" });
                setMenuDisp((prevValue) => !prevValue);
              }}
            >
              Sort: Lowest First
            </div>
            <div className="dd-bt">Range Filter</div>
            <MultiRangeSlider
              min={minVal(column.id)}
              max={maxVal(column.id)}
              onChange={({ min, max }) => setSliderValues({min:min, max:max})}
            />
            <button style={{margin:"10px auto"}} className="bt-blue" onClick={() => handleSliderSubmit(column.id)}>Apply</button>
            </div>
        )}
        {isDescSort && <i className=" arrow-ico fa-solid fa-sort-up"></i>}
        {isAscSort && <i className=" arrow-ico fa-solid fa-sort-down"></i>}
        <br />
        <br /> {column.name}
      </th>
    )
  );
};

export default function TableHeader({ sorting, sortTable, setSerApp, setRange }) {

    const columns = useSelector((state) => state.metricsCopy.value);
    const appNameList = useSelector((state) => state.appName.value);
    const minMax = useSelector((state) => state.minMax.value);
    const dispatch = useDispatch();

  return (
    <thead>
      <tr>
        {columns.map((column) => (
          <HeaderCell column={column} sorting={sorting} sortTable={sortTable} setSerApp={setSerApp} appNameList={appNameList} minMax={minMax} dispatch={dispatch} setRange={setRange}/>
        ))}
      </tr>
    </thead>
  );
}
