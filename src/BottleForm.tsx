import { Bottle } from "./types"
import InputSelect from "./InputSelect"

interface Props {
    item: Bottle
    bottles: Bottle[]
    loading: boolean
    readOnly?: boolean
    handleChange: (key: keyof Bottle, value: string) => void
}

export interface FormItem {
    label?: string
    key: keyof Bottle
    value: string
    strictValidation?: boolean
}

enum AutoFillField { YES = "YES", NO = "NO" }

export default function BottleForm({ item, bottles, loading, readOnly = false, handleChange }: Props) {
    const fields: Array<{ label: string, key: keyof Bottle, formItems?: FormItem[], strictValidation?: boolean }> = [
        { label: "region", key: "What country or region is this wine from?", strictValidation: true },
        {
            label: "winery", key: "Winery Name", formItems: [
                { label: "Winery Name", key: "Winery Name", value: AutoFillField.YES },
                { label: "Winery Phone", key: "Winery Phone #", value: AutoFillField.NO },
                { label: "Winery Email", key: "Winery Email", value: AutoFillField.NO }
            ]
        },
        {
            label: "distributor", key: "Distributor Name", formItems: [
                { label: "Distributor Name", key: "Distributor Name", value: AutoFillField.YES },
                { label: "Distributor Phone", key: "Distributor Phone #", value: AutoFillField.NO },
                { label: "Distributor Email", key: "Distributor Email", value: AutoFillField.NO }
            ]
        },
    ]

    const handleAdd = (formItems: FormItem[], name: string) => {
        console.log("Add", name)
        for (const item of formItems) {
            let response = prompt(`Add new ${item.label}`, item.value == AutoFillField.YES ? name : undefined)
            if (!response) {
                return
            }
            console.log(response)
            
        }
    }

    return <>
        {fields.map(({ label, key, formItems, strictValidation }) =>
            <InputSelect
                key={`${item["Wine ID"]}-${label}`}
                label={label}
                items={bottles}
                _key={key}
                loading={loading}
                initialValue={String(item[key])}
                readOnly={readOnly}
                strictValidation={strictValidation ?? undefined}
                handleChange={(event) => handleChange(key, event.currentTarget.value)}
                handleAdd={formItems ? (event) => {
                    const name = event.currentTarget.closest(".InputSelect")?.querySelector("input")?.value ?? ""
                    handleAdd(formItems, name)
                } : undefined}
            />
        )}
        <div className="InputSelect">
            <label htmlFor="price">price: </label>
            <input
                id="price"
                type="number"
                readOnly={readOnly} disabled={readOnly}
                value={item["Wine Price"]}
                onChange={(e) => {handleChange("Wine Price", e.target.value)}}>
            </input>
        </div>
    </>
}