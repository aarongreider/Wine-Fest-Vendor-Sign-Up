import { useState } from 'react';
import { Icon_Add } from './Icons';

interface props {
    label: string,
    id: string,
    items: Record<string, unknown>[],
    _key: string
    loading: boolean
    initialValue?: string
    readOnly?: boolean
    strictValidation?: boolean
    requireQuery?: boolean
    handleChange: (e: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent<HTMLInputElement> | React.FocusEvent<HTMLInputElement>, value?: string) => void
    handleAdd?: (e: React.MouseEvent<HTMLButtonElement>, value: string, clear: () => void) => void
}

const cleanString = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

/* combo input and select button, the input filters the list of items */
export default function InputSelect({ label, id, items, _key, loading, initialValue, readOnly = false, strictValidation = true, requireQuery = true, handleChange, handleAdd }: props) {
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
        handleAdd?.(e, searchQuery.trim(), () => setSearchQuery(''))
        setFocused(false)
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.currentTarget.parentElement?.contains(e.relatedTarget as Node)) return

        if (strictValidation && searchQuery.trim() && !hasExactMatch) {
            alert(`This ${label.toLowerCase()} does not exist yet. Please retype the name of the ${label.toLowerCase()} and select the button that says "+ Add New ${label}." 

If you have already added this ${label.toLowerCase()}, please verify that what you typed is free of typos, or select a suggested value.`)
            e.currentTarget.value = ''
            setSearchQuery('')
            handleChange(e, '')
        }
        setFocused(false)
    }

    return <>
        <div className="InputSelect">
                <label htmlFor={id}>{label}:</label>
                <input name={id} id={id} value={searchQuery} readOnly={readOnly} disabled={readOnly} type="text" autoComplete="off"
                    onChange={(e) => handleQueryPush(e, true)}
                    onFocus={() => setFocused(true)}
                    onBlur={handleBlur}
                />
           
            {handleAdd && searchQuery.trim() && !hasRoughMatch && focused &&
                    <div style={{ width: '100%', padding: "0" }}>
                        <button type="button" className="flex row btn dark add_new" onMouseDown={(e) => e.preventDefault()} onClick={handleAddClick}>
                            <Icon_Add /> Add New {label} &quot;{searchQuery.trim()}&quot;
                        </button>
                    </div>}
            <div className="select-container" style={{ display: `${focused ? 'flex' : 'none'}` }}>
                {focused && (!requireQuery || Boolean(searchQuery.trim())) && !readOnly && (!hasExactMatch || filteredValues.length > 1) ?
                    <>
                        {filteredValues.map((value) =>
                            <button key={value} value={value}
                                onMouseDown={(e) => {
                                    e.preventDefault()
                                    handleQueryPush(e)
                                }}>
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