import React, {ChangeEvent, useEffect, useState} from 'react';
import css from './SearchItemForm.module.scss';
import {TextField} from './TextField';
import {useDebounce} from '../common/hooks/useDebounce';

type SearchItemFormType = {
    onChange: (value: string) => void
    searchValue: string
}

export const SearchItemForm: React.FC<SearchItemFormType> = React.memo(({onChange, searchValue}) => {
    const [value, setValue] = useState(searchValue)
    const debounce = useDebounce(value, 700)

    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
    }

    useEffect(() => {
            onChange(debounce)
        // eslint-disable-next-line
    }, [debounce])

    return (
        <TextField
            onChange={onChangeHandler}
            value={value}
            className={css.input}
            placeholder={'Search by tag'}
        />
    );
});