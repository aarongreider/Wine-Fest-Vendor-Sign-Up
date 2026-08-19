import { useState } from 'react';

interface props {
    label: string,
    items: Record<string, unknown>[],
    _key: string
    handleChange: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const cleanString = (value: string) =>
    value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

/* combo input and select button, the input filters the list of items */
export default function InputSelect({ label, items, _key, handleChange }: props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [focused, setFocused] = useState<boolean>(false);
    const filteredItems = items.filter((item) =>
        cleanString(String(item[_key])).includes(cleanString(searchQuery))
    );

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        handleChange(e)
        //@ts-ignore
        setSearchQuery(e.target.value)
        setFocused(false)
    }

    return <>
        <div className="InputSelect">
            <label htmlFor="select">{label}:</label>
            <input value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onFocus={() => setFocused(true)}
            />
            <div className="select-container">
                {focused ?
                    filteredItems.length > 0
                        ? filteredItems.map((item) =>
                            <button key={`${item[_key]}-${Math.random()}`} value={String(item[_key])}
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