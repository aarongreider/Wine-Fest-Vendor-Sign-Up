import { Region } from "../types"

interface props {
    region: Region,
    index: number,
    pageNum: number
}

export function RegionCover({ region, index, pageNum }: props) {
    return <div key={`region-${index}`} className="page regionCover">

        <div className={`bleed ${pageNum % 2 == 0 ? "right" : "left"}`}>
            <img className="spineGuides" src="./src/assets/spine-guides.png" />

            <img className="cropMark top left" src="./src/assets/crop-mark.png" />
            <img className="cropMark top right" src="./src/assets/crop-mark.png" />
            <img className="cropMark bottom left" src="./src/assets/crop-mark.png" />
            <img className="cropMark bottom right" src="./src/assets/crop-mark.png" />

            <div className="bleedContent">
                <div className="content">
                    <p>Destination</p>
                    <hr />
                    <h1>{region.name}</h1>
                </div>
                <p className={`pageNumber ${pageNum % 2 == 0 ? "right" : "left"}`}>{pageNum}</p>
            </div>
        </div>
    </div>
}

export default RegionCover