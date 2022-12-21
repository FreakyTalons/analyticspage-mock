import React from 'react';
import icon from "../assets/icon.png";
import { useSelector } from 'react-redux';

export default function Content ({data}) 
{

  const columns = useSelector((state) => state.metricsCopy.value);
  

  return(
      <tbody>
       {
        data.map((entry,index) => (
          <tr key={index}>
            {columns.map((column) => (
                column.id === 'date'?
                  (column.disp && <td style={{textAlign:'left'}}>{entry['date'].substring(0,10)}</td>):
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