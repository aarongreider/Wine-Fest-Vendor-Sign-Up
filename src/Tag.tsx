import { useState } from "react"
import { Bottle } from "./types"
import InputSelect from "./InputSelect"

interface props {
    item: Bottle,
    items: Bottle[],
    deleteBottle: (item: Bottle) => void
    editBottle: (item: Bottle) => void
}

export default function Tag({ item, items, deleteBottle, editBottle }: props) {
    const [toggled, setToggled] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)
    const [draft, setDraft] = useState<Bottle>(item)

    const handleEdit = (key: keyof Bottle, value: string) => {
        setDraft((currentDraft) => ({ ...currentDraft, [key]: value }))
    }

    const toggle = () => {
        setToggled(!toggled)
    }

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
                    <div className="flex">
                        <p>region: </p>
                        <InputSelect
                            label="region"
                            items={items}
                            _key="What country or region is this wine from?"
                            value={String(draft["What country or region is this wine from?"])}
                            readOnly={!editing}
                            handleInputChange={(value) => handleEdit("What country or region is this wine from?", value)}
                        />
                    </div>
                    <div className="flex">
                        <InputSelect
                            label="winery"
                            items={items}
                            _key="Winery Name"
                            value={draft["Winery Name"]}
                            readOnly={!editing}
                            handleInputChange={(value) => handleEdit("Winery Name", value)}
                        />
                    </div>
                    <div className="flex">
                        <InputSelect
                            label="distributor"
                            items={items}
                            _key="Distributor Name"
                            value={draft["Distributor Name"]}
                            readOnly={!editing}
                            handleInputChange={(value) => handleEdit("Distributor Name", value)}
                        />
                    </div>
                    <u onClick={() => deleteBottle(item)}>Delete Wine</u>
                    {editing
                        ? <u onClick={() => { editBottle(draft); setEditing(false) }}>Save Changes to Wine</u>
                        : <u onClick={() => { setEditing(true) }}>Edit Wine</u>
                    }
                </div>
            </div>
        </>
    )
}