import { useState } from "react"
import { Booth, Bottle } from "./types"
import BottleForm from "./BottleForm"

interface props {
    bottles: Bottle[]
    activeBooth: Booth
    loading: boolean
    addBottle: (item: Bottle) => void
}
export default function NewBottleForm({ bottles, activeBooth, loading, addBottle }: props) {
    const [draftItem, setDraftItem] = useState<Bottle>({
        "Booth Name": activeBooth.name,
        "Timestamp": new Date().toISOString(),
        "Booth #": Number(activeBooth.number),
        "Distributor Name": "",
        "Winery Name": "",
        "Wine Name / Type": "",
        "What country or region is this wine from?": "",
        "Wine Price": 0,
        "Wine ID": crypto.randomUUID(),
        "Is this a connoisseur/VIP wine?": "",
        "New Distributor Name": "",
        "New Winery Name": "",
        "If your booth name is not on the list above, enter a new one below. This name will be what is displayed on your booth at the festival.": "",
        "My distributor is not on the list above. I'd like to enter a new distributor": "",
        "My winery is not on the list above. I'd like to enter a new winery": "",
        "Distributor Phone #": "",
        "Distributor Email": "",
        "Winery Phone #": "",
        "Winery Email": "",
        "Email Address": "",
        "Continue?": "",
    })

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        const requiredFields = [
            draftItem["Winery Name"],
            draftItem["Distributor Name"],
            draftItem["Wine Name / Type"],
            draftItem["What country or region is this wine from?"],
        ]

        if (requiredFields.some((field) => field.trim() === "")) {
            alert("Please provide a winery, distributor, wine name, and region.")
            return
        }

        addBottle(draftItem as Bottle)
    }

    const handleBottleChange = (key: keyof Bottle, value: string) => {
        setDraftItem((currentDraft) => ({ ...currentDraft, [key]: value }))
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, key: String) => {
        console.log(e)
        setDraftItem({ ...draftItem, [`${key}`]: e.target.value })
    }
    return <>
        <div className="flex">
            <label htmlFor="wineNameNew">Wine Name or Type</label>
            <input type="text" id="wineNameNew" onChange={(e) => handleInputChange(e, "Wine Name / Type")}></input>
        </div>
        <BottleForm
            item={draftItem}
            bottles={bottles}
            loading={loading}
            handleChange={handleBottleChange}
        />

        <button onClick={handleSubmit}>Add Wine</button>
    </>
}