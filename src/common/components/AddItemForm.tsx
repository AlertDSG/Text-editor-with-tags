import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {TextField} from "./TextField";
import {Button} from "./Button";

type AddItemFormType = {
    onClickSet: (value: string) => void
}

export const AddItemForm: React.FC<AddItemFormType> = ({onClickSet}) => {
    const [value, setValue] = useState('')

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    const onClickHandler = () => {
        if (value.trim() !== '') {
            onClickSet(value)
            setValue('')
        }
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key.toLowerCase() === 'enter') {
            onClickHandler()
        }
    }

    return <>
        <TextField
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            value={value}/>
        <Button name={'Add todo'} onClickHandler={onClickHandler}/>
    </>
};