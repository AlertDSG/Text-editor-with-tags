import React, {useEffect, useState} from 'react';
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

    const onChangeTodoHandler = (value: string, id: string) => {
        const tag = searchTags(value)
        const oldTag = state.data.filter(e => e.id)[0].tag
        const searchTag = state.tags.find(t => t.tag === tag)
        const data = state.data.map(e => e.id === id ? {...e, text: value, tag} : e)
        if (tag === oldTag) {
            setState({...state, data: state.data.map(e => e.id === id ? {...e, text: value} : e)})
        } else if (tag && !oldTag) {
            setState({
                ...state,
                data,
                tags: searchTag ? state.tags : [...state.tags, {tag, isActive: false}]
            })
        } else if (tag && tag !== oldTag) {
            setState({
                ...state,
                data,
                tags: searchTag ? state.tags.filter(t => t.tag !== oldTag) : [...state.tags, {tag, isActive: false}]
            })
        } else {
            const data = state.data.map(d => d.id === id ? {...d, tag: null} : d)
            const tags = oldTag && state.data.filter(t => t.tag === oldTag).length === 1 ? state.tags.filter(t => t.tag !== oldTag) : state.tags
            setState({...state, data, tags})
        }
    }

    const removeItem = (id: string, tag: null | string) => {
        const data = state.data.filter(d => d.id !== id)
        const tags = tag && state.data.filter(t => t.tag === tag).length === 1 ? state.tags.filter(t => t.tag !== tag) : state.tags
        setState({...state, data, tags})
    }

    const colorHandler = (text: string) => {
        if (!text) {
            setState({...state, tags: state.tags.map(t => t.isActive ? {...t, isActive: false} : t)})
        }
        const texts = text.split(' ')
        for (let i = 0; i < texts.length; i++) {
            if (state.tags.find(t => t.tag === '#' + texts[i])) {
                setState({...state, tags: state.tags.map(t => t.tag === '#' + texts[i] ? {...t, isActive: true} : t)})
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
