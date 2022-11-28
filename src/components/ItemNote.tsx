import React from 'react';
import css from './ItemNote.module.scss';
import {TextField} from './TextField';
import {useDebounce} from '../common/hooks/useDebounce';
import SvgComponent from "./SVGComponent";

type ItemType = {
    id: string
    tag: string | null
    text: string
    onChange: (value: string, id: string) => void
    removeItem: (Id: string, tag: string | null) => void
    colorHandler: (value: string) => void
    onChangeTag: (value: string, text: string, id: string, oldTag: string | null) => void
}

export const ItemNote: React.FC<ItemType> = ({
                                                 id,
                                                 tag,
                                                 text,
                                                 onChange,
                                                 removeItem,
                                                 colorHandler,
                                                 onChangeTag
                                             }) => {
    const [value, setValue] = React.useState(text)
    const [valueTag, setValueTag] = React.useState(tag ? tag : '')
    const [isEditable, setIsEditable] = React.useState(false)
    const [isTag, setIsTag] = React.useState(false)
    const debounce = useDebounce(value, 700)

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    const onBlurHandler = () => {

        setIsEditable(false)
        colorHandler('')
    }
    const setTagHandler = () => {
        setIsTag(false)
        if (valueTag !== null) {
            onChangeTag(valueTag, text, id, tag)
        }
    }

    const onKeyPressHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ' ') {
            colorHandler(value)
        }
    }

    React.useEffect(() => {
        if (debounce){
            onChange(debounce, id)
        }
        // eslint-disable-next-line
    }, [debounce, id])

    return (
        <div className={css.item}>
            <div className={css.itemBody}>
                {!isEditable
                    ?
                    <p
                        className={css.itemText}
                        onDoubleClick={() => setIsEditable(true)}
                    >
                        {text}
                        <SvgComponent style={{marginLeft: '25px'}}/>
                    </p>
                    :
                    <TextField
                        onChange={onChangeHandler}
                        onBlur={onBlurHandler}
                        className={css.input}
                        onKeyPress={onKeyPressHandler}
                        defaultValue={text}
                    />

                }
                <span className={css.span} onClick={() => removeItem(id, tag)}>X</span>
            </div>
            {tag && <>
                {!isTag ?
                    <h3 className={css.tag}>
                        <span onDoubleClick={() => setIsTag(true)}>
                        {tag}
                        </span>
                    </h3>
                    : <TextField
                        defaultValue={tag}
                        onBlur={setTagHandler}
                        onChange={(e) => setValueTag(e.currentTarget.value)}
                    />}
            </>}
        </div>
    );
}