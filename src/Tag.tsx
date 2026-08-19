import { Bottle } from "./types"

interface props {
    item: Bottle,
    deleteBottle: (item: Bottle) => void
}

export default function Tag({ item, deleteBottle }: props) {
    return (
        <>
            <div className='tag'>
                <div onClick={() => deleteBottle(item)}
                    style={{ transform: "rotate(45deg)", height: "min-content", /* width: "min-content", */ cursor: "pointer" }}><p>+</p></div>
                <p key={`${item["Wine Name / Type"]}`}>{item["Wine Name / Type"]}</p>
            </div>
        </>
    )
}