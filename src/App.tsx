import React from 'react';
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

const initial = {
    data: [] as DataType[],
    tags: [],
}

function App() {

    const [state, setState] = React.useState<StateType>(initial)
    const [searchValue, setSearchValue] = React.useState('')

    React.useEffect(() => {
        const localState = localStorage.getItem('state')
        if (localState) {
            setState(JSON.parse(localState))
        }
    }, [])

    React.useEffect(() => {
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

    const onChangeTodoHandler = (text: string, id: string) => {
        const tag = searchTags(text)
        const todo = state.data.find(e => e.id === id)
        if (!todo) return
        const data = state.data.map(e => e.id === id ? {...e, text: text.trim(), tag} : e)
        let tags = state.tags
        const searchTag = tags.find(t => t.tag === tag)
        if (tag && !todo.tag) {
            tags = searchTag ? tags : [...tags, {tag, isActive: false}]
        } else if (tag && todo.tag && tag !== todo.tag) {
            if (!data.find(d => d.tag === todo.tag)) {
                tags = tags.filter(t => t.tag !== todo.tag)
            }
            if (!searchTag) {
                tags = [...tags, {tag, isActive: false}]
            }
        } else if (!tag && todo) {
            tags = data.find(t => t.tag === todo.tag) ? state.tags : state.tags.filter(t => t.tag !== todo.tag)
        }
        setState({...state, data, tags})
    }

    let filteredState = state
    if (searchValue !== '') {
        filteredState = {...state, data: state.data.filter(d => d.tag === searchValue)}
    }

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

    const changeTag = (tag: string, text: string, id: string, oldTag: string | null) => {
        const tagChecked = searchTags(tag)
        const texts: string[] = text.split(' ')
        const indexOldTag = oldTag && texts.indexOf(oldTag)
        let newTexts = [...texts];
        if (tagChecked && oldTag) {
            indexOldTag && newTexts.splice(indexOldTag, 1, tagChecked)
        }
        if (!tagChecked && oldTag) {
            indexOldTag && newTexts.splice(indexOldTag, 1, '')
        }
        if (!oldTag && tagChecked) {
            newTexts = [...texts, tagChecked]
        }
        const data = state.data.map(d => d.id === id ? {...d, tag: tagChecked, text: newTexts.join(' ').trim()} : d)
        let tags: TagType[] = state.tags
        if (!data.find(d => d.tag === oldTag)) {
            tags = tags.filter(t => t.tag !== oldTag)
            if (tagChecked && !tags.find(d => d.tag === tagChecked)) {
                tags = [...tags, {tag: tagChecked, isActive: false}]
            }
        } else if (tagChecked && !tags.find(d => d.tag === tagChecked)) {
            tags = [...tags, {tag: tagChecked, isActive: false}]
        }

        setState({...state, data, tags})
    }

    const todos = filteredState.data
        .map(d =>
            <ItemNote
                key={d.id}
                tag={d.tag}
                id={d.id}
                text={d.text}
                removeItem={removeItem}
                colorHandler={colorHandler}
                onChangeTag={changeTag}
                onChange={onChangeTodoHandler}/>)

    return (
        <div className="wrapper">
            <div className="container">
                <div className={"inputs-body"}>
                    <AddItemForm onClickSet={onClickHandler}/>
                    <SearchItemForm onChange={onChangeSearchHandler} searchValue={searchValue}/>
                </div>
                <div className="tags">
                    {state.tags.length > 0 && state.tags.map(t => <span
                        className="tag"
                        key={t.tag}
                        style={{color: t.isActive ? "red" : "black"}}> {t.tag} </span>)}
                </div>

                <div>{todos}</div>
            </div>

        </div>
    );
}

export default App;
