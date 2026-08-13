import { Bottle } from "../types";


interface props {
    bottle: Bottle
}

export function BottleLayout({ bottle }: props) {
    return <div className="bottle">
        
        <div className="details">
            <p className="wineID">{bottle["Wine ID"]}</p>
            <h2>{bottle["Wine Name / Type"]}</h2>
            
        </div>
        <h2 >Quantity:</h2>
    </div>

}

export default BottleLayout