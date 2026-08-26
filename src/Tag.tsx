import { useEffect, useState } from "react"
import { Bottle } from "./types"
import InputSelect from "./InputSelect"

interface props {
    item: Bottle,
    bottles: Bottle[],
    loading: boolean,
    deleteBottle: (item: Bottle) => void
    editBottle: (item: Bottle) => void
}

export default function Tag({ item, bottles, loading, deleteBottle, editBottle }: props) {
    const [toggled, setToggled] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)
    const [draftItem, setDraftItem] = useState<Bottle>(item)

    const handleEdit = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Handle edit logic here
    }
    const handleComboSelectChange = (e: React.MouseEvent<HTMLButtonElement>, key: String) => {
        console.log(e)
        const target = e.target as HTMLButtonElement
        setDraftItem({...draftItem, [`${key}`]: target.value})
    }

    const toggle = () => {
        setToggled(!toggled)
    }

    useEffect(()=>{
        console.log(draftItem)
    }, [draftItem])

    return (
        <>
            <div className='tag' style={{ background: `${editing ? 'rgb(91 59 12)' : ''}` }}>
                <div className="banner" onClick={toggle}>
                    <h3>{item["Wine Name / Type"]}</h3>
                    <div
                        style={{ height: "min-content", cursor: "pointer" }}>
                        <p style={{ transform: "translateY(-4px)" }}>⌄</p>
                    </div>
                </div>
                <div className="content" style={{ display: `${toggled ? "flex" : "none"}`, flexDirection: "column" }}>
                    {/* <div className="flex">
                        <p>region: </p>
                        <input type="text" readOnly={!editing} value={item["What country or region is this wine from?"]} onChange={handleEdit} />
                    </div> */}

                    {/* <div className="flex">
                        <p>winery: </p>
                        <input type="text" readOnly={!editing} value={item["Winery Name"]} onChange={handleEdit} />
                    </div> */}
                    {/* <div className="flex">
                        <p>distributor: </p>
                        <input type="text" readOnly={!editing} value={item["Distributor Name"]} onChange={handleEdit} />
                    </div> */}
                    <InputSelect
                        key={`region ${item["What country or region is this wine from?"]}`}
                        label={"region"}
                        items={bottles}
                        _key={"What country or region is this wine from?"}
                        loading={loading}
                        initialValue={item["What country or region is this wine from?"]}
                        readOnly={!editing}
                        handleChange={(e)=>handleComboSelectChange(e, "What country or region is this wine from?")} />
                    <InputSelect
                        key={`winery ${item["Winery Name"]}`}
                        label={"winery"}
                        items={bottles}
                        _key={"Winery Name"}
                        loading={loading}
                        initialValue={item["Winery Name"]}
                        readOnly={!editing}
                        handleChange={(e)=>handleComboSelectChange(e, "Winery Name")} />
                    <InputSelect
                        key={`distributor ${item["Distributor Name"]}`}
                        label={"distributor"}
                        items={bottles}
                        _key={"Distributor Name"}
                        loading={loading}
                        initialValue={item["Distributor Name"]}
                        readOnly={!editing}
                        handleChange={(e)=>handleComboSelectChange(e, "Distributor Name")} />
                    <u onClick={() => deleteBottle(item)}>Delete Wine</u>
                    {editing
                        ? <u onClick={() => { editBottle(draftItem); setEditing(false) }}>Save Changes to Wine</u>
                        : <u onClick={() => { setEditing(true) }}>Edit Wine</u>
                    }
                </div>
            </div>
        </>
    )
}