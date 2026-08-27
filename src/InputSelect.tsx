import { useState } from 'react';

interface props {
    label: string,
    items: Record<string, unknown>[],
    _key: string
    loading: boolean
    initialValue?: string
    readOnly?: boolean
    strictValidation?: boolean
    handleChange: (e: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>) => void
    handleAdd?: (e: React.MouseEvent<HTMLButtonElement>, value: string) => void
}

const cleanString = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

/* combo input and select button, the input filters the list of items */
export default function InputSelect({ label, items, _key, loading, initialValue, readOnly = false, strictValidation = false, handleChange, handleAdd }: props) {
    const [searchQuery, setSearchQuery] = useState(initialValue || '');
    const [focused, setFocused] = useState<boolean>(false);
    const filteredItems = items.filter((item) =>
        cleanString(String(item[_key])).includes(cleanString(searchQuery))
    );
    const filteredValues = [...new Set(filteredItems.map((item) => String(item[_key])))];
    const hasRoughMatch = items.some((item) =>
        cleanString(String(item[_key])) === cleanString(searchQuery)
    );
    const hasExactMatch = items.some((item) =>
        String(item[_key]).trim() === searchQuery.trim()
    );

    const handleQueryPush = (e: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement>, _focused = false) => {
        handleChange(e)
        setSearchQuery(e.currentTarget.value)
        setFocused(_focused)
    }

    const handleAddClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleAdd?.(e, searchQuery.trim())
        setFocused(false)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) return

        if (strictValidation && searchQuery.trim() && !hasExactMatch) {
            alert(`Invalid ${label}. Please select a suggested value.`)
            e.currentTarget.value = ''
            setSearchQuery('')
            handleChange(e)
        }
        setFocused(false)
    }

    return <>
        <div className="InputSelect">
            <label htmlFor="select">{label}:</label>
            <input value={searchQuery} readOnly={readOnly} disabled={readOnly} type="text"
                onChange={(e) =>handleQueryPush(e, true)}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
            />
            {handleAdd && searchQuery.trim() && !hasRoughMatch &&
                <div style={{ width: '100%', padding: "10px 0" }}>
                    <button type="button" onClick={handleAddClick} style={{ background: "#676767", color: "white", padding: '10px' }}>
                        + Add new {label} &quot;{searchQuery.trim()}&quot;
                    </button>
                </div>}
            <div className="select-container" style={{ display: `${focused ? 'flex' : 'none'}` }}>
                {focused && !readOnly && (!hasExactMatch || filteredValues.length > 1) ?
                    <>
                        {filteredValues.map((value) =>
                            <button key={value} value={value}
                                onClick={handleQueryPush}>
                                {value}
                            </button>)}

                        {loading && <i>loading...</i>}
                    </>
                    : undefined
                }
            </div>
        </div>
    </>
}