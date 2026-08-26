import { useState } from 'react';

interface props {
    label: string,
    items: Record<string, unknown>[],
    _key: string
    value?: string
    readOnly?: boolean
    handleChange?: (e: React.MouseEvent<HTMLButtonElement>) => void
    handleInputChange?: (value: string) => void
}

const cleanString = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

/* combo input and select button, the input filters the list of items */
export default function InputSelect({ label, items, _key, value, readOnly = false, handleChange, handleInputChange }: props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [focused, setFocused] = useState<boolean>(false);
    const inputValue = value ?? searchQuery;
    const filteredItems = items.filter((item) =>
        cleanString(String(item[_key])).includes(cleanString(inputValue))
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleChange?.(e)
        //@ts-ignore
        const selectedValue = e.target.value as string
        setSearchQuery(selectedValue)
        handleInputChange?.(selectedValue)
        setFocused(false)
    }

    return <>
        <div className="InputSelect">
            <label htmlFor="select">{label}:</label>
            <input value={inputValue}
                readOnly={readOnly}
                onChange={(event) => {
                    setSearchQuery(event.target.value)
                    handleInputChange?.(event.target.value)
                }}
                onFocus={() => setFocused(!readOnly)}
            />
            <div className="select-container">
                {focused ?
                    filteredItems.length > 0
                        ? filteredItems.map((item) =>
                            <button key={String(item[_key])} value={String(item[_key])}
                                onClick={handleClick}>
                                {String(item[_key])}
                            </button>)
                        : <i>loading...</i>
                    : undefined
                }
            </div>
        </div>
    </>
}