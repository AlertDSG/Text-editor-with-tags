import React, {ChangeEvent, useEffect, useState} from 'react';
import css from './ItemNote.module.scss';
import {DataType} from '../App';
import {TextField} from './TextField';
import {useDebounce} from '../common/hooks/useDebounce';
import SvgComponent from "./SVGComponent";

type ItemType = {
    item: DataType
    onChange: (value: string) => void
    removeItem: (Id: string, tag: string | null) => void
    colorHandler: (value: string) => void
}

export const ItemNote: React.FC<ItemType> = ({item, onChange, removeItem, colorHandler}) => {
    const [value, setValue] = useState(item.text)
    const [isEditable, setIsEditable] = useState(false)

    const debounce = useDebounce(value, 1000)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }
    const onBlurHandler = () => {
        setIsEditable(false)
        colorHandler('')
    }

    const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') {
            colorHandler(value)
        }
    }

    useEffect(() => {
        if (debounce !== item.text) {
            onChange(debounce)
        }
    }, [debounce])

    return (
        <div className={css.itemBody}>
            {!isEditable
                ?
                <p
                    className={css.itemText}
                    onDoubleClick={() => setIsEditable(true)}
                >
                    {item.text}
                    <SvgComponent style={{marginLeft: '25px'}}/>
                </p>
                :
                <TextField
                    value={value}
                    onChange={onChangeHandler}
                    onBlur={onBlurHandler}
                    className={css.input}
                    onKeyPress={onKeyPressHandler}
                />
            }
            <span className={css.span} onClick={() => removeItem(item.id, item.tag)}>X</span>
        </div>
    );
};