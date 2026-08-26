import { useState } from "react"
import { Booth, Bottle } from "./types"
import InputSelect from "./InputSelect"

interface props {
    bottles: Bottle[]
    activeBooth: Booth
    addBottle: (item: Bottle) => void
}
export default function NewBottleForm({ bottles, activeBooth, addBottle }: props) {
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

    const handleComboSelectChange = (e: React.MouseEvent<HTMLButtonElement>, key: String) => {
        console.log(e)
        const target = e.target as HTMLButtonElement
        setDraftItem({ ...draftItem, [`${key}`]: target.value })
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
        <InputSelect
            key={`regionNew`}
            label={"region"}
            items={bottles}
            _key={"What country or region is this wine from?"}
            handleChange={(e) => handleComboSelectChange(e, "What country or region is this wine from?")} />
        <InputSelect
            key={`wineryNew`}
            label={"winery"}
            items={bottles}
            _key={"Winery Name"}
            handleChange={(e) => handleComboSelectChange(e, "Winery Name")} />
        <InputSelect
            key={`distributorNew`}
            label={"distributor"}
            items={bottles}
            _key={"Distributor Name"}
            handleChange={(e) => handleComboSelectChange(e, "Distributor Name")} />

        <button onClick={handleSubmit}>Add Wine</button>
    </>
}