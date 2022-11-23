import React from 'react';
import css from './Button.module.scss';

type ButtonType = {
    name: string
    onClickHandler: () => void
    className?: string
    disabled?: boolean
}

export const Button: React.FC<ButtonType> = ({name, onClickHandler, className, disabled}) => {

    const styleBtn = className ? `${css.btn} ${className}` : css.btn

    return <button
        className={styleBtn}
        onClick={onClickHandler}
        disabled={disabled}
    >
        {name}
    </button>

};