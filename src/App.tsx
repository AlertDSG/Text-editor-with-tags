import React, {useState} from 'react';
import './App.css';
import {AddItemForm} from "./common/components/AddItemForm";
import {SearchItemForm} from "./common/components/SearchItemForm";
import {ItemNote} from "./common/components/ItemNote";
import {searchTags} from "./common/utils/searchTag-utils";

export type DataType = {
    id: string
    text: string
    tag: null | string
}

type StateType = {
    data: DataType[]
    tags: string[]
}

function App() {
    const initial = {
        data: [] as DataType[],
        tags: [],
    }
    const [state, setState] = useState<StateType>(initial)
    const [searchValue, setSearchValue] = useState('')

    const onClickHandler = (value: string) => {
        const tag = searchTags(value)

        const newNote = {
            id: String(new Date().getTime()),
            text: value,
            tag: tag
        }
        setState({...state, data: [...state.data, newNote], tags: tag ? [...state.tags, tag] : state.tags})
    }

    const onChangeSearchHandler = (value: string) => {
        setSearchValue(value)
    }
    let filteredState = state
    if (searchValue !== '') {
        filteredState = {...state, data: state.data.filter(d => d.tag === searchValue)}
    }

    const onChangeTodoHandler = (value: string, id: string) => {
        debugger
        const tag = searchTags(value)
        const oldTag = state.data.filter(e => e.id)[0].tag
        if (tag === oldTag) {
            setState({...state, data: state.data.map(e => e.id === id ? {...e, text: value} : e)})
        } else if (tag && !oldTag) {
            setState({
                ...state,
                data: state.data.map(e => e.id === id ? {...e, text: value, tag: tag} : e),
                tags: state.tags.includes(tag) ? state.tags : [...state.tags, tag]
            })
        }
        else if (tag && tag !== oldTag) {
            setState({
                ...state,
                data: state.data.map(e => e.id === id ? {...e, text: value, tag: tag} : e),
                tags: state.tags.includes(tag) ? state.tags.filter(t => t !== oldTag) : [...state.tags, tag]
            })
        }
    }

    return (
        <div className="App">
            <AddItemForm onClickSet={onClickHandler}/>
            <SearchItemForm onChange={onChangeSearchHandler}/>
            <div>
                {state.tags.length > 0 && state.tags.map(t => <span>{t} </span>)}
            </div>

            {filteredState.data.map(d => <ItemNote key={d.id} item={d}
                                                   onChange={(value) => onChangeTodoHandler(value, d.id)}/>)}

        </div>
    );
}

export default App;
