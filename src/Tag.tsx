import { useEffect, useState } from "react"
import { flushSync } from "react-dom"
import { Bottle } from "./types"
import BottleForm from "./BottleForm"
import { Icon_Construction, Icon_Delete, Icon_Edit, Icon_Save } from "./Icons"

interface props {
    item: Bottle,
    bottles: Bottle[],
    loading: boolean,
    deleteBottle: (item: Bottle) => void
    editBottle: (item: Bottle) => void
    setDirtyItem: (dirty: Record<string, boolean>) => void
    submitForm: (item: Bottle) => void
}

export default function Tag({ item, bottles, loading, deleteBottle, editBottle, setDirtyItem, submitForm }: props) {
    const [toggled, setToggled] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)
    const [draftItem, setDraftItem] = useState<Bottle>(item)

    const handleBottleChange = (key: keyof Bottle, value: string | number) => {
        console.log("handling bottle change", key, value)
        setDraftItem((currentDraft) => ({ ...currentDraft, [key]: value }))
    }

    const toggle = () => {
        setToggled(!toggled)
    }

    const handleDeleteBottle = () => {
        setEditing(false)
        deleteBottle(item)
    }

    const handleSave = () => {
        editBottle(draftItem)

        const form = document.getElementById('formroot') as HTMLFormElement | null
        const isValid = form ? form.checkValidity() : true

        if (!isValid) {
            setEditing(true)
            setDirtyItem({ [`${item["Wine_ID"]}`]: true })
            form?.reportValidity()
            return
        }

        flushSync(() => {
            setEditing(false)
            setDirtyItem({ [`${item["Wine_ID"]}`]: false })
        })

        submitForm(draftItem)
    }

    useEffect(() => {
        setDraftItem(item)
    }, [item["Wine_ID"]])

    useEffect(() => {
        setDirtyItem({ [`${item["Wine_ID"]}`]: editing })
    }, [editing])

    return (
        <>
            <div className='tag' style={{ background: `${editing ? 'rgb(91 59 12)' : ''}` }}>
                <div className="banner" onClick={(e) => {
                    const clickedElement = e.target as HTMLElement
                    if (clickedElement.closest('#save_shortcut')) return
                    toggle()
                }}>
                    <div className="flex row">
                        {editing ? <Icon_Construction /> : undefined}
                        <h3>{item.Wine_Name}</h3>
                    </div>
                    <div className="flex row" style={{ gap: '20px' }}>
                        <button id="save_shortcut" className="utility flex row" disabled={!editing} style={{ display: `${editing ? "flex" : "none"}` }}
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleSave() }}>
                            <Icon_Save />
                        </button>
                        <div
                            style={{ height: "min-content", cursor: "pointer" }}>
                            <p style={{ transform: "translateY(-4px)" }}>⌄</p>
                        </div>
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

                    <div className="utilities flex row">
                        <button className="utility flex row" id="edit_wine" disabled={editing}
                            onClick={(e) => { e.preventDefault(); setEditing(true) }}>
                            <Icon_Edit /> Edit Wine
                        </button>
                        <button className="utility flex row" id="save_wine" disabled={!editing}
                            onClick={(e) => { e.preventDefault(); handleSave() }}>
                            <Icon_Save /> Save Changes
                        </button>
                        <button className="utility flex row" id="delete_wine" disabled={editing}
                            onClick={(e) => { e.preventDefault(); handleDeleteBottle() }}>
                            <Icon_Delete /> Delete Wine
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}