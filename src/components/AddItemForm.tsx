import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import css from './AddItemForm.module.scss'
import {TextField} from './TextField';
import {Button} from './Button';

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

    return <div className={css.itemForm}>
        <TextField
            onChange={onChangeHandler}
            onKeyPress={onKeyPressHandler}
            value={value}
            className={css.input}
            placeholder={'Add todo'}
        />
        <Button
            name={'Add todo'}
            onClickHandler={onClickHandler}
            className={value === '' ? css.btnDisabled : css.btn}
            disabled={value === ''}
        />
    </div>
};