import React, { useEffect, useState } from 'react'
import "./App.css"
import { fetchWineData, groupBooths, groupRegions } from './utils.ts';
import { Booth, Bottle, Region } from './types.ts';


function App() {
  const [booths, setBooths] = useState<Booth[]>([])
  const [regions, setRegions] = useState<Region[]>([])

  useEffect(() => {  // fetch the initial data and set the state 
    const fetchData = async () => {
      try {
        //console.log("Fetching data");
        const _bottles: Bottle[] = await fetchWineData();
        const _booths: Booth[] = groupBooths(_bottles);
        const _regions: Region[] = groupRegions(_booths);
        console.log(_regions)
        //setBooths(sortedData);
        setRegions(_regions)
      } catch {
        console.log("Error fetching data in useEffect");
      }
    };

    fetchData();
  }, [])

  return <div id="all">
    {/* consider slicing booths in pieces because html2pdf taps out around 25 pages */}
    {regions.map((region, i) => {
      return <React.Fragment key={i}>
        {region.booths.map((booth, index) => {
          return <div key={index} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: "flex-start", width: '8.5in', height: '11in', padding: '.25in', boxSizing: 'border-box',  }}>
            <h1>{booth.name}</h1>
            <h2>{booth.bottles[0]['What country or region is this wine from?']} — table: {booth.number}</h2>
            <br></br>
            <table style={{ border: '1px solid black' }}>
              <tr>
                <th style={{ width: '175px', textAlign:'left' }}>Buyer's Club #</th>
                {booth.bottles.map((bottle, index) => {
                  return <th key={index} style={{padding: '5px 10px'}}>{bottle['Wine Name / Type']}</th>
                })}
              </tr>
              {[...Array(30)].map((_, k) => {
                return <tr key={k}>
                  {[...Array(booth.bottles.length + 1)].map((_, j) => {
                    return <td key={j}></td>
                  })}
                </tr>
              })}
            </table>
          </div>
        })}
      </React.Fragment>
    })}

  </div >
}

export default App