import { FormEvent, useState } from "react"

interface Props {
    name?: string
    email?: string
    onClose: () => void
    fields?: Record<string, string>
    onSubmit?: (fields: Record<string, string>) => void
}

export default function DialogModal({ name, email, onClose, fields = {}, onSubmit }: Props) {
    const initialFields: Record<string, string> = {
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...fields,
    }
    const [values, setValues] = useState(initialFields)

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmit?.(values)
        onClose()
    }

    return (
        <dialog open>
            <form onSubmit={handleSubmit}>
                {Object.keys(initialFields).map((field) => (
                    <label key={field}>
                        {field}
                        <input
                            name={field}
                            value={values[field]}
                            onChange={(event) => setValues({ ...values, [field]: event.target.value })}
                        />
                    </label>
                ))}
                <button type="submit">Submit</button>
                <button type="button" onClick={onClose}>Close</button>
            </form>
        </dialog>
    )
}
