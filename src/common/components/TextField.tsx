import React, {ChangeEvent, KeyboardEvent} from 'react';

type TextFieldType = {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void
    onBlur?: () => void
    placeholder?: string
    value?: string
}

export const TextField: React.FC<TextFieldType> = (
    {onChange,onKeyPress, onBlur, placeholder, value}
) => {

    return <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyPress={onKeyPress}
            onBlur={onBlur}
        />
};