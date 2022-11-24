import React, {useCallback, useEffect, useState} from 'react';
import './App.scss';
import {AddItemForm} from "./components/AddItemForm";
import {SearchItemForm} from "./components/SearchItemForm";
import {ItemNote} from "./components/ItemNote";
import {searchTags} from "./common/utils/searchTag-utils";

export type DataType = {
    id: string
    text: string
    tag: null | string
}

type TagType = {
    tag: string
    isActive: boolean
}

type StateType = {
    data: DataType[]
    tags: TagType[]
}

function App() {
    const initial = {
        data: [] as DataType[],
        tags: [],
    }
    const [state, setState] = useState<StateType>(initial)
    const [searchValue, setSearchValue] = useState('')

    useEffect(() => {
        const localState = localStorage.getItem('state')
        if (localState) {
            setState(JSON.parse(localState))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('state', JSON.stringify(state))
    }, [state])

    const onClickHandler = (value: string) => {
        const tag = searchTags(value)

        const newNote = {
            id: String(new Date().getTime()),
            text: value,
            tag
        }
        setState({
            ...state,
            data: [...state.data, newNote],
            tags: tag && !state.tags.find(t => t.tag === tag) ? [...state.tags, {tag, isActive: false}] : state.tags
        })
    }

    const onChangeSearchHandler = (value: string) => {
        setSearchValue(value)
    }

    let filteredState = state
    if (searchValue !== '') {
        filteredState = {...state, data: state.data.filter(d => d.tag === searchValue)}
    }

    const onChangeTodoHandler = useCallback((value: string, id: string) => {

        const tag = searchTags(value)
        const oldTag = state.data.find(e => e.id === id)
        const searchTag = state.tags.find(t => t.tag === tag)
        if (!oldTag) return
        const data = state.data.map(e => e.id === id ? {...e, text: value, tag} : e)
        if (tag === oldTag.tag) {
            setState({...state, data: state.data.map(e => e.id === id ? {...e, text: value} : e)})
        } else if (tag && !oldTag.tag) {
            setState({
                ...state,
                data,
                tags: searchTag ? state.tags : [...state.tags, {tag, isActive: false}]
            })
        } else if (tag && oldTag.tag && tag !== oldTag.tag) {
            setState({
                ...state,
                data,
                tags: searchTag ? state.tags.filter(t => t.tag !== oldTag.tag) : [...state.tags, {tag, isActive: false}]
            })
        } else if (!tag && oldTag) {
            const tags = data.find(t => t.tag === oldTag.tag) ? state.tags : state.tags.filter(t => t.tag !== oldTag.tag)
            setState({...state, data, tags})
        }
    }, [state])

    const removeItem = (id: string, tag: null | string) => {
        const data = state.data.filter(d => d.id !== id)
        const tags = tag && state.data.find(t => t.tag === tag) ? state.tags.filter(t => t.tag !== tag) : state.tags
        setState({...state, data, tags})
    }

    const colorHandler = (text: string) => {
        if (!text) {
            setState({...state, tags: state.tags.map(t => t.isActive ? {...t, isActive: false} : t)})
        } else {
            const texts = text.split(' ')
            for (let i = 0; i < texts.length; i++) {
                if (state.tags.find(t => t.tag === '#' + texts[i])) {
                    setState({
                        ...state,
                        tags: state.tags.map(t => t.tag === '#' + texts[i] ? {...t, isActive: true} : t)
                    })
                }
            }
        }
    }

    const todos = filteredState.data
        .map(d =>
            <ItemNote
                key={d.id}
                item={d}
                removeItem={removeItem}
                colorHandler={colorHandler}
                onChange={(value) => onChangeTodoHandler(value, d.id)}/>)

    return (
        <div className="wrapper">
            <div className="container">
                <div className={"inputs-body"}>
                    <AddItemForm onClickSet={onClickHandler}/>
                    <SearchItemForm onChange={onChangeSearchHandler}/>
                </div>
                <div className="tags">
                    {state.tags.length > 0 && state.tags.map(t => <span
                        key={t.tag}
                        style={{color: t.isActive ? "red" : "black"}}> {t.tag} </span>)}
                </div>

                <div>{todos}</div>
            </div>

        </div>
    );
}

export default App;
