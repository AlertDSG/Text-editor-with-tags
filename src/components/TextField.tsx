import React, {ChangeEvent, KeyboardEvent} from 'react';
import css from './TextField.module.scss'

type TextFieldType = {
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
    onKeyPress?: (e: KeyboardEvent<HTMLInputElement>) => void
    onBlur?: () => void
    placeholder?: string
    value?: string
    className?: string
    defaultValue?: string
}

export const TextField: React.FC<TextFieldType> = React.memo ((
    {onChange, onKeyPress, onBlur, placeholder, value, className, defaultValue}
) => {

    const styleInput = className ? `${css.textField} ${className}` : css.textField

    return <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        onBlur={onBlur}
        defaultValue={defaultValue}
        autoFocus
        className={styleInput}
    />
});