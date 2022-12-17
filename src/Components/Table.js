import React, {useEffect, useState} from "react";
import { fetchData } from "../store/dataSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchAppData } from "../store/appNameSlice";
import icon from "../assets/icon.png";
import img404 from "../assets/img404.svg";

const HeaderCell = ({column, sorting, sortTable}) =>
{
  const isDescSort = sorting.column === column.id && sorting.order === "desc";
  const isAscSort = sorting.column === column.id && sorting.order === "asc";
  const futureSortingOrder = isDescSort? "asc":"desc";
  return(
    column.disp && <th className={column.class}>
    <i class=" funnel-ico fa-solid fa-filter" onClick={() => sortTable({column:column.id, order:futureSortingOrder})}></i> 
    {isAscSort && <i class=" funnel-ico fa-solid fa-sort-up"></i>}
    {isDescSort && <i class=" funnel-ico fa-solid fa-sort-down"></i>}
    <br/><br/> { column.name}
    </th>
  )
}

const TableHeader = ({columns, sorting, sortTable}) =>
{
  return(
    <thead>
      <tr>
        {columns.map((column) => 
         <HeaderCell column={column} sorting={sorting} sortTable={sortTable}/>
        )}
      </tr>
    </thead>
  )
}

const Content = ({data, columns}) =>
{

  return(
      <tbody>
       {
        data.map((entry,index) => (
          <tr key={index}>
            {columns.map((column) => (
                column.id === 'date'?
                  (column.disp && <td style={{textAlign:'left'}}>{entry[column.id].substring(0,10)}</td>):
                    (column.id === 'fill_rate'?
                      (column.disp && <td style={{textAlign:'center'}}>{Math.round(entry['fill_rate']*100)/100}</td>):
                        (column.id === 'CTR'?
                          (column.disp && <td style={{textAlign:'center'}}>{Math.round(entry['CTR']*100)/100}</td>):
                            (column.id === 'revenue'?
                              (column.disp && <td style={{textAlign:'center'}}>₹{Math.round(entry['revenue']*100)/100}</td>):
                                (column.id === 'app_id'?
                                  (<td style={{textAlign:'left'}}><img style={{width:'24px'}} src={icon} alt="app logo"/>{entry['app_name']}</td>):
                                    (column.disp && <td style={{textAlign:'center'}}>{entry[column.id]}</td>)))))
            ))}
          </tr>
        ))
       }
      </tbody>
  )
}

export default function Table() {
  const dispatch = useDispatch();

  const reqURL = useSelector((state) => state.reqs.value);
  const metrics = useSelector((state) => state.metricsCopy.value);
  const data0 = useSelector((state) => state.data);
  const appNameList = useSelector((state) => state.appName.value);
  const [data, setData] = useState([]) 
  const [sorting, setSorting] = useState({column:'date', order:'asc'})   

  const sortTable = (newSorting) => {
    setSorting(newSorting)
  }

  useEffect(() => {
    dispatch(fetchData(reqURL.URL))
    dispatch(fetchAppData())
  }, [reqURL])

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
                let tempObj = {...data0.value[i], app_name:appNameList[j].app_name, fill_rate: ((data0.value[i].requests/data0.value[i].responses)*100), CTR: ((data0.value[i].clicks/data0.value[i].impressions)*100)};
                newData.push(tempObj);
              }
          }  
      }
      setData(newData)
    } 
    finDataCreator();
  }, [reqURL,data0, appNameList])

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


  return (<div className="table-div">
  {data0.loading && <div className="loading-text">Please wait while we fetch your data...</div>}
  {!data0.loading && data0.error ? <div className="div-404">
    <div><img src={img404} className='img-404' alt='404'/></div>
    <div><p className="txt1">Hey! Something's off! <br/> We couldn't display the given data.</p>
    <p className="txt2">Try changing your filters or selecting a different date.</p></div>
  </div>:
   null}
  {!data0.loading && data0.value.length ? (
    <table className="cust-table" id="1234">
      <TableHeader columns={metrics} sorting={sorting} sortTable={sortTable}/>
      <Content data={data} columns={metrics} appNameList={appNameList} />
    </table> 
  ) : null }
  </div>);
}
