import React, {ChangeEvent, useEffect, useState} from 'react';
import {DataType} from "../../App";
import {TextField} from "./TextField";
import {useDebounce} from "../hooks/useDebounce";

type ItemType = {
    item: DataType
    onChange: (value: string) => void
}

export const ItemNote: React.FC<ItemType> = ({item, onChange}) => {
    const [value, setValue] = useState(item.text)
    const [isEditable, setIsEditable] = useState(false)

    const debounce = useDebounce(value, 1000)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }
    const onBlurHandler = () => {
        setIsEditable(false)
    }

    useEffect(() => {
        if(debounce !== item.text){
            onChange(debounce)
        }
    },[debounce, item.text, onChange])

    return (
        <div>
            {!isEditable
                ?
                <p onDoubleClick={() => setIsEditable(true)}>{item.text}</p>
                :
                <TextField
                    value={value}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                />
            }
        </div>
    );
};