import { Bottle } from "./types"
import InputSelect from "./InputSelect"

interface Props {
    item: Bottle
    bottles: Bottle[]
    loading: boolean
    readOnly?: boolean
    handleChange: (key: keyof Bottle, value: string) => void
}

export default function BottleForm({ item, bottles, loading, readOnly = false, handleChange }: Props) {
    const fields: Array<{ label: string, key: keyof Bottle }> = [
        { label: "region", key: "What country or region is this wine from?" },
        { label: "winery", key: "Winery Name" },
        { label: "distributor", key: "Distributor Name" },
    ]

    return <>
        {fields.map(({ label, key }) =>
            <InputSelect
                key={`${item["Wine ID"]}-${label}`}
                label={label}
                items={bottles}
                _key={key}
                loading={loading}
                initialValue={String(item[key])}
                readOnly={readOnly}
                handleChange={(event) => handleChange(key, event.currentTarget.value)}
            />
        )}
    </>
}
