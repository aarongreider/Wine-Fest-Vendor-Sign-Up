import { useState } from 'react';

interface props {
    label: string,
    items: Record<string, unknown>[],
    _key: string
    initialValue?: string
    readOnly?: boolean
    handleChange: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const cleanString = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

/* combo input and select button, the input filters the list of items */
export default function InputSelect({ label, items, _key, initialValue, readOnly=false, handleChange }: props) {
    const [searchQuery, setSearchQuery] = useState(initialValue || '');
    const [focused, setFocused] = useState<boolean>(false);
    const filteredItems = items.filter((item) =>
        cleanString(String(item[_key])).includes(cleanString(searchQuery))
    );
    const filteredValues = [...new Set(filteredItems.map((item) => String(item[_key])))];

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleChange(e)
        //@ts-ignore
        setSearchQuery(e.target.value)
        setFocused(false)
    }

    return <>
        <div className="InputSelect">
            <label htmlFor="select">{label}:</label>
            <input value={searchQuery} readOnly={readOnly} disabled={readOnly} type="text" 
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setFocused(true)}
            />
            <div className="select-container" style={{display:`${focused ? 'flex' : 'none'}`}}>
                {focused ?
                    filteredItems.length > 0
                        ? filteredValues.map((value) =>
                            <button key={value} value={value}
                                onClick={handleClick}>
                                {value}
                            </button>)
                        : <i>loading...</i>
                    : undefined
                }
            </div>
        </div>
    </>
}