import { Bottle } from "./types"
import InputSelect from "./InputSelect"

interface Props {
    item: Bottle
    bottles: Bottle[]
    loading: boolean
    readOnly?: boolean
    handleChange: (key: keyof Bottle, value: string | number) => void
}

export interface FormItem {
    label?: string
    key: keyof Bottle
    value: string
    strictValidation?: boolean
    requireQuery?: boolean
}

enum AutoFillField { YES = "YES", NO = "NO" }

export default function BottleForm({ item, bottles, loading, readOnly = false, handleChange }: Props) {
    const formId = `bottle-${String(item["Wine_ID"]).replace(/[^a-zA-Z0-9_-]/g, "-")}`
    const fields: Array<{ label: string, key: keyof Bottle, formItems?: FormItem[], strictValidation?: boolean, requireQuery?: boolean }> = [
        { label: "Region", key: "Region", strictValidation: true, requireQuery: false },
        {
            label: "Winery", key: "Winery Name", formItems: [
                { label: "Winery Name", key: "Winery Name", value: AutoFillField.YES },
                { label: "Winery Phone", key: "Winery Phone #", value: AutoFillField.NO },
                { label: "Winery Email", key: "Winery Email", value: AutoFillField.NO }
            ]
        },
        {
            label: "Distributor", key: "Distributor Name", formItems: [
                { label: "Distributor Name", key: "Distributor Name", value: AutoFillField.YES },
                { label: "Distributor Phone", key: "Distributor Phone #", value: AutoFillField.NO },
                { label: "Distributor Email", key: "Distributor Email", value: AutoFillField.NO }
            ]
        },
    ]

    const handleAdd = (formItems: FormItem[], name: string, clear: () => void) => {
        console.log("Add", name)
        for (const item of formItems) {
            const response = prompt(`Add New ${item.label}`, item.value === AutoFillField.YES ? name : undefined)
            if (!response) {
                clear()
                handleChange(item.key, "")
                return
            }
            handleChange(item.key, response)
            console.log(response)
        }
    }

    return <>
    <div className="InputSelect">
            <label htmlFor={`${formId}-NameType`}>Wine Name: </label>
            <input
                id={`${formId}-NameType`}
                type="text"
                readOnly={readOnly} disabled={readOnly}
                value={item.Wine_Name}
                onChange={(e) => { handleChange("Wine_Name", e.target.value) }}>
            </input>
        </div>
        {fields.map(({ label, key, formItems, strictValidation, requireQuery }) =>
            <InputSelect
                key={`${item["Wine_ID"]}-${label}`}
                label={label}
                id={`${formId}-${label.toLowerCase()}`}
                items={bottles}
                _key={key}
                loading={loading}
                initialValue={String(item[key])}
                readOnly={readOnly}
                strictValidation={strictValidation ?? undefined}
                requireQuery={requireQuery ?? undefined}
                handleChange={(event) => handleChange(key, event.currentTarget.value)}
                handleAdd={formItems ? (event, _name, clear) => {
                    const name = event.currentTarget.closest(".InputSelect")?.querySelector("input")?.value ?? ""
                    handleAdd(formItems, name, clear)
                } : undefined}
            />
        )}
        <div className="InputSelect">
            <label htmlFor={`${formId}-price`}>Price: </label>
            <input
                id={`${formId}-price`}
                type="number"
                readOnly={readOnly} disabled={readOnly}
                value={item.Price}
                onChange={(e) => { handleChange("Price", e.target.value) }}>
            </input>
        </div>
        <div className="InputSelect">
            <label htmlFor={`${formId}-vip`}>VIP Wine? </label>
            <input
                id={`${formId}-vip`}
                type="checkbox"
                readOnly={readOnly} disabled={readOnly}
                checked={item.Is_VIP === "Yes"}
                onChange={(e) => { handleChange("Is_VIP", e.target.checked ? "Yes" : "No") }}>
            </input>
        </div>
    </>
}