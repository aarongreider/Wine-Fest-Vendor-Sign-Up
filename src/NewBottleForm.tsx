import { useState } from "react"
import { Booth, Bottle } from "./types"
import BottleForm from "./BottleForm"
import { Icon_Add } from "./Icons"

interface props {
    bottles: Bottle[]
    activeBooth: Booth
    loading: boolean
    addBottle: (item: Bottle) => void
}
export default function NewBottleForm({ bottles, activeBooth, loading, addBottle }: props) {
    const now = new Date().toISOString()
    const bottleId = String(crypto.randomUUID())

    const [draftItem, setDraftItem] = useState<Bottle>({
        Created_Time: now,
        Modified_Time: "",
        "Booth #": String(activeBooth.number),
        Booth_Name: activeBooth.name,
        Wine_Name: "",
        Price: 0,
        Region: "",
        Is_VIP: "No",
        Wine_ID: bottleId,
        "Submitter Email Address": "",
        "Distributor Name": "",
        "Distributor Phone #": "",
        "Distributor Email": "",
        "Winery Name": "",
        "Winery Phone #": "",
        "Winery Email": "",
    })

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const requiredFields = [
            draftItem["Winery Name"],
            draftItem["Distributor Name"],
            draftItem.Wine_Name,
            draftItem.Region,
            draftItem.Price,
        ]

        if (requiredFields.some((field) => `${field}`.trim() === "")) {
            alert("Please provide a wine name, region, winery, distributor, and price.")
            return
        }

        addBottle(draftItem as Bottle)
    }

    const handleBottleChange = (key: keyof Bottle, value: string | number) => {
        setDraftItem((currentDraft) => ({ ...currentDraft, [key]: value }))
    }
    return <>
        <div className="flex column card">
            <BottleForm
                item={draftItem}
                bottles={bottles}
                loading={loading}
                handleChange={handleBottleChange}
            />
            <button onClick={handleSubmit} className="flex row btn dark">
                <Icon_Add />{`Add New wine to booth`.toUpperCase()}
            </button>
        </div>
    </>
}