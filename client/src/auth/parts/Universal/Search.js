import React from "react"
import useHighlight from "../../../common_hooks/highlight.hook"
import "./styles/search.css"

const Search = ({searchValue, setSearchValue}) => {
    const {randomBlockShadow} = useHighlight()
    //Компонент поиска
    return (     
        <div className={`search ${randomBlockShadow()}`}>
            <input value={searchValue} onChange={(e) => setSearchValue(e.target.value)} type="search" className="search-field" placeholder="Поиск..." />
        </div>

    )
}

export default Search