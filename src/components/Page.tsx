import { Booth } from "../types";
import BoothLayout from './BoothLayout';


interface props {
    booths: Booth[],
    index: number,
    pageNum: number
}

export function Page({ booths, index }: props) {
    return <div key={`${index}`} className={`page`}>

        <div className={`bleed`}>


            <div className="bleedContent">
                <div className="buyerIdContainer" style={{display: "flex", gap: '12px', justifyContent: 'space-between', width: '100%', flexDirection: 'column'}}>
                    <h1>Buyer's Club #:</h1>
                    <div className="buyerIdBox" style={{flex: '1 1 auto', height: '.5in', borderRadius: '5px', marginBottom: '30px'}}></div>
                </div>
                {booths[index]
                    ? <BoothLayout booth={booths[index]} key={`booth-${index}`} index={index} classAttr="top" />
                    : undefined}
            </div>
        </div>
    </div >
}

export default Page