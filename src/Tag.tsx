import { useEffect, useState } from "react"
import { Bottle } from "./types"
import BottleForm from "./BottleForm"

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

    const handleBottleChange = (key: keyof Bottle, value: string) => {
        console.log("handling bottle change", key, value)
        setDraftItem((currentDraft) => ({ ...currentDraft, [key]: value }))
    }

    const toggle = () => {
        setToggled(!toggled)
    }

    useEffect(() => {
        //console.log(draftItem)
    }, [draftItem])

    useEffect(() => {
        setDraftItem(item)
    }, [item["Wine ID"]])

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
                    <BottleForm
                        item={draftItem}
                        bottles={bottles}
                        loading={loading}
                        readOnly={!editing}
                        handleChange={handleBottleChange}
                    />
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