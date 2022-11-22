import React, {ChangeEvent, useEffect, useState} from 'react';
import {TextField} from "./TextField";
import {useDebounce} from "../hooks/useDebounce";

type SearchItemFormType = {
    onChange: (value: string) => void
}

export const SearchItemForm: React.FC<SearchItemFormType> = ({onChange}) => {
    const [value, setValue] = useState('')
    const debounce = useDebounce(value, 1000)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    useEffect(() => {
        onChange(debounce)
    },[debounce, onChange])

    return (
        <TextField onChange={onChangeHandler} value={value}/>
    );
};