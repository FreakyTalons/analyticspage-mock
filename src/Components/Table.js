import React, {useEffect, useState} from "react";
import { fetchData } from "../store/dataSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchAppData } from "../store/appNameSlice";
import Content from "./Content";
import TableHeader from "./TableHeader";
import img404 from "../assets/img404.svg";
import { setMinMax } from "../store/minMaxSlice";
import { setDataCopy, setDispClrFilter } from "../store/clrFilterSlice";


export default function Table() {
  
  const [data, setData] = useState([]) 
  const [sorting, setSorting] = useState({column:'date', order:'asc'})   
  const [serApp, setSerApp] = useState([])
  const [range, setRange] = useState({})
 
  const reqURL = useSelector((state) => state.reqs.value);
  const data0 = useSelector((state) => state.data);
  const appNameList = useSelector((state) => state.appName.value);
  const minMax = useSelector((state) => state.minMax.value);
  const clear = useSelector((state) => state.clrFilter.dispClrFilter)
  const copyData = useSelector((state) => state.clrFilter.dataCopy)

  const dispatch = useDispatch();

  const sortTable = (newSorting) => {
    setSorting(newSorting)
  }
 
// function to get metrics data and app data from the API
useEffect(() => {
  dispatch(fetchData(reqURL.URL))
  dispatch(fetchAppData())
}, [reqURL])

//function to create the final dataset for mapping
useEffect(() => {

  const finDataCreator = () =>
  {
    const newData = [];

    for (let i = 0; i < data0.value.length; i++) 
    {
        for (let j = 0; j < appNameList.length; j++)
        {
            if (data0.value[i].app_id === appNameList[j].app_id)
            {
              let tempObj = {...data0.value[i], app_name:appNameList[j].app_name, fill_rate: Math.round((data0.value[i].requests/data0.value[i].responses)*10000)/100, CTR: Math.round((data0.value[i].clicks/data0.value[i].impressions)*10000)/100};
              newData.push(tempObj);
            }
        }  
    }
    setData(newData)
  } 
  finDataCreator(); 
}, [reqURL,data0, appNameList])

//function to decide min max of each metric
  useEffect(() => {
    if(data[0])
    {
      //let newData= data0.value;
      const minMaxCreator = () =>
      {
        const newMinMax = [];
        for(let i=0;i<minMax.length;i+=1)
        {
          const metric = minMax[i].id;
          const tempArr = [];
          for(let j=0; j<data.length; j+=1)
          {
            metric === 'revenue'? tempArr.push(Math.round(data[j][metric]*100)/100) : tempArr.push(data[j][metric]);
          }
         newMinMax.push({id:metric, max:Math.max(...tempArr), min:Math.min(...tempArr)})
        }
        dispatch(setMinMax(newMinMax))
      }
      minMaxCreator()
    }
  },[data0,reqURL,data, serApp, range])

  //function for data sorting
  useEffect(() => {
    const copy = [...data];
    const col = sorting.column;
    const arraySorter = () =>
    { 
      if(col === 'app_id')
      {
        if(sorting.order === 'desc')
        {
          copy.sort((a, b) => {
            let fa = a.app_name.toLowerCase(),
                fb = b.app_name.toLowerCase();
        
            if (fa < fb) {
                return -1;
            }
            if (fa > fb) {
                return 1;
            }
            return 0;
          });
        }
        if(sorting.order === 'asc')
        {
          copy.sort((a, b) => {
            let fa = a.app_name.toLowerCase(),
                fb = b.app_name.toLowerCase();
        
            if (fa > fb) {
                return -1;
            }
            if (fa < fb) {
                return 1;
            }
            return 0;
          });
        }
        setData(copy);
      }
      else if (sorting.column === 'date')
      {
        if(sorting.order === 'asc')
        {
          copy.sort((a, b) => {
            let da = new Date(a.date),
                db = new Date(b.date);
            return da - db;
          });
        }
        if(sorting.order === 'desc')
        {
          copy.sort((a, b) => {
            let da = new Date(a.date),
                db = new Date(b.date);
            return db - da;
          });
        }
        setData(copy);
      }
      else
      {
        
        if(sorting.order === 'asc')
        {
          copy.sort((a, b) => {
            return a[col] - b[col];
          });
        }
        if(sorting.order === 'desc')
        {
          copy.sort((a, b) => {
            return b[col] - a[col];
          });
        }
        setData(copy);
      }
    }
    arraySorter();
  }, [sorting])

 //function to filter data according to app
  useEffect(() => {
    let tempArr = [];
    for(let i=0;i<serApp.length;i++)
    {
      const filteredData = data.filter(row =>
        row.app_name.toLowerCase().includes(serApp[i].toLowerCase())
      );
      tempArr = [...tempArr, ...filteredData]
    }
    dispatch(setDataCopy(data))
    setData(tempArr);
  },[serApp])


  useEffect(() => {
    const tempArr = [];
    let metric = range.id;
    for(let i=0; i<data.length; i++)
    {
      if(data[i][metric]>=range.min && data[i][metric]<=range.max)
        tempArr.push(data[i])
    }
    dispatch(setDataCopy(data))
    setData(tempArr);
  },[range])


  let op1 = {opacity:"1"};
  let op0 = {opacity:"0"};

  return (<div className="table-div">
  {data0.loading && <div className="loading-text">Please wait while we fetch your data...</div>}
  {(!data0.loading && data0.error) || data.length===0 ? <div className="div-404">
    <div><img src={img404} className='img-404' alt='404'/></div>
    <div><p className="txt1">Hey! Something's off! <br/> We couldn't display the given data.</p>
    <p className="txt2">Try changing your filters or selecting a different date.</p></div>
  </div>:
   null}
  {!data0.loading && data0.value.length && data.length ? (
    <>
    <button className="bt-blue" style={clear?op1:op0} onClick={() => {setData(copyData);dispatch(setDispClrFilter())}}>Clear Filters</button>
    <br/> <br/>
    <table className="cust-table" id="1234">
      <TableHeader sorting={sorting} sortTable={sortTable} setSerApp={setSerApp} setData={setData} setRange={setRange}/>
      <Content data={data}/>
    </table> 
    </>
  ) : null }
  </div>);
}
