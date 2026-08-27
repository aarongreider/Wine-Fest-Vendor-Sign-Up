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
}

enum AutoFillField { YES = "YES", NO = "NO" }

export default function BottleForm({ item, bottles, loading, readOnly = false, handleChange }: Props) {
    const fields: Array<{ label: string, key: keyof Bottle, formItems?: FormItem[] }> = [
        { label: "region", key: "What country or region is this wine from?" },
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
            handleChange(item.key, response)
        }
    }

    /* const handleAddDistributor = (distributorName: string) => {
        return <>
            <DialogModal name={distributorName} email={""} onClose={() => {handleChange() }} />
        </>
    } */

    return <>
        {fields.map(({ label, key, formItems }) =>
            <InputSelect
                key={`${item["Wine ID"]}-${label}`}
                label={label}
                items={bottles}
                _key={key}
                loading={loading}
                initialValue={String(item[key])}
                readOnly={readOnly}
                handleChange={(event) => handleChange(key, event.currentTarget.value)}
                handleAdd={formItems ? (event) => {
                    const name = event.currentTarget.closest(".InputSelect")?.querySelector("input")?.value ?? ""
                    handleAdd(formItems, name)
                } : undefined}
            />
        )}

        {/* <InputSelect
            key={`${item["Wine ID"]}-distributor`}
            label={"distributor"}
            items={bottles}
            _key={"Distributor Name"}
            loading={loading}
            initialValue={String(item["Distributor Name"])}
            readOnly={readOnly}
            handleChange={(event) => handleChange("Distributor Name", event.currentTarget.value)}
            handleAdd={() => handleAddDistributor(item["Distributor Name"])}
        /> */}
    </>
}