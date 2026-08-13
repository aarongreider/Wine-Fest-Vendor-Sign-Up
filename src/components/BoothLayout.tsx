
import { nanoid } from 'nanoid';
import { Booth, Bottle } from "../types";
import BottleLayout from './BottleLayout';
import QRCode from 'qrcode'
import { useEffect, useState } from 'react';


interface props {
    booth: Booth,
    index: number,
    classAttr: string
}

export function BoothLayout({ booth, index, classAttr: position }: props) {

    return <>
        <div className={`boothContainer ${position}`} key={`page-${index}-${nanoid()}`}>

            <div className='banner'>
                <div className='tableNumContainer'>
                    <p>TABLE</p>
                    <span className='tableNum'>{booth.bottles[0]["Booth #"]}</span>
                </div>
            </div>

            <div className='title'>
                <div className='nameAndRegion'>
                    <h1>{booth.bottles[0]["Booth Name"]}</h1>
                    <p className="region">{booth.bottles[0]['What country or region is this wine from?']}</p>
                </div>
            </div>

            <div className="bottles">
                {booth.bottles.map((wine: Bottle, index) => {
                    return <BottleLayout bottle={wine} key={index}></BottleLayout>
                })}
            </div>
        </div>
    </>
}

export default BoothLayout