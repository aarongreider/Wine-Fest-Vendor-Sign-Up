import { useState } from 'react';

interface props {
    label: string,
    items: Record<string, unknown>[],
    _key: string
    loading: boolean
    initialValue?: string
    readOnly?: boolean
    handleChange: (e: React.MouseEvent<HTMLButtonElement>) => void
    handleAdd?: (value: string) => void
}

const cleanString = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

/* combo input and select button, the input filters the list of items */
export default function InputSelect({ label, items, _key, loading, initialValue, readOnly = false, handleChange, handleAdd }: props) {
    const [searchQuery, setSearchQuery] = useState(initialValue || '');
    const [focused, setFocused] = useState<boolean>(false);
    const filteredItems = items.filter((item) =>
        cleanString(String(item[_key])).includes(cleanString(searchQuery))
    );
    const filteredValues = [...new Set(filteredItems.map((item) => String(item[_key])))];
    const hasExactMatch = items.some((item) =>
        cleanString(String(item[_key])) === cleanString(searchQuery)
    );

    const handleQueryPush = (e: React.MouseEvent<HTMLButtonElement> | React.ChangeEvent, _focused = false) => {
        //@ts-ignore
        handleChange(e)
        //@ts-ignore
        setSearchQuery(e.target.value)
        setFocused(_focused)
    }

    const handleAddClick = () => {
        handleAdd?.(searchQuery.trim())
        setFocused(false)
    }

    return <>
        <div className="InputSelect">
            <label htmlFor="select">{label}:</label>
            <input value={searchQuery} readOnly={readOnly} disabled={readOnly} type="text"
                onChange={(e) =>handleQueryPush(e, true)}
                onFocus={() => setFocused(true)}
            />
            {handleAdd && searchQuery.trim() && !hasExactMatch &&
                <div style={{ width: '100%', padding: "10px 0" }}>
                    <button type="button" onClick={handleAddClick} style={{ background: "#676767", color: "white", padding: '10px' }}>
                        + Add New Item &quot;{searchQuery.trim()}&quot;
                    </button>
                </div>}
            <div className="select-container" style={{ display: `${focused ? 'flex' : 'none'}` }}>
                {focused ?
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