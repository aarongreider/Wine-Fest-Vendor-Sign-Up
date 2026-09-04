import { useEffect, useState } from "react"
import { Bottle } from "./types"
import BottleForm from "./BottleForm"
import { Icon_Construction } from "./Icons"

interface props {
    item: Bottle,
    bottles: Bottle[],
    loading: boolean,
    deleteBottle: (item: Bottle) => void
    editBottle: (item: Bottle) => void
    setDirtyItem: (dirty: Record<string, boolean>) => void
}

export default function Tag({ item, bottles, loading, deleteBottle, editBottle, setDirtyItem }: props) {
    const [toggled, setToggled] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)
    const [draftItem, setDraftItem] = useState<Bottle>(item)

    const handleBottleChange = (key: keyof Bottle, value: string) => {
        console.log("handling bottle change", key, value)
        setDraftItem((currentDraft) => ({ ...currentDraft, [key]: value }))
    }

    const toggle = () => {
        setToggled(!toggled)
        //editBottle(draftItem)
    }

    const handleDeleteBottle = () => {
        setEditing(false)
        deleteBottle(item)
    }

    useEffect(() => {
        //console.log(draftItem)
        //editBottle(draftItem)
    }, [draftItem])

    useEffect(() => {
        setDraftItem(item)
    }, [item["Wine ID"]])

    useEffect(() => {
        setDirtyItem({ [`${item["Wine ID"]}`]: editing })
    }, [editing])

    return (
        <>
            <div className='tag' style={{ background: `${editing ? 'rgb(91 59 12)' : ''}` }}>
                <div className="banner" onClick={toggle}>
                    <div className="flex row">
                        {editing ? <Icon_Construction /> : undefined}
                        <h3>{item["Wine Name / Type"]}</h3>
                    </div>
                    <div
                        style={{ height: "min-content", cursor: "pointer" }}>
                        <p style={{ transform: "translateY(-4px)" }}>⌄</p>
                    </div>
                </div>
                <div className="content" style={{ display: `${toggled ? "flex" : "none"}`, flexDirection: "column" }}>
                    <BottleForm
                        item={draftItem}
                        bottles={bottles}
                        loading={loading}
                        readOnly={!editing}
                        handleChange={handleBottleChange}
                    />
                    
                    <div className="flex column" style={{fontSize: '14px', lineHeight: '1', color: "grey", alignItems: "flex-end", alignSelf: "flex-end", textAlign: "right"}}>
                        <p>{item["Winery Name"]}</p>
                        <p>{item["Winery Email"]}</p>
                        <p>{item["Winery Phone #"]}</p>
                        <p>{item["Distributor Name"]}</p>
                        <p>{item["Distributor Email"]}</p>
                        <p>{item["Distributor Phone #"]}</p>
                    </div>

                    <u onClick={handleDeleteBottle}>Delete Wine</u>
                    {editing
                        ? <u onClick={() => { editBottle(draftItem); setEditing(false) }}>Save Changes to Wine</u>
                        : <u onClick={() => { setEditing(true) }}>Edit Wine</u>
                    }
                </div>
            </div>
        </>
    )
}