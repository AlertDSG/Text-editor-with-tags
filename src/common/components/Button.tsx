import React from 'react';

type ButtonType = {
    name: string
    onClickHandler: () => void
    className?: string
}

export const Button: React.FC<ButtonType> = ({name, onClickHandler, className}) => {

    return <button
        className={className}
        onClick={onClickHandler}>
        {name}
    </button>

};