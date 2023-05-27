const Search = ({searchValue, setSearchValue}) => {

    return (
        <div className="videohost-search">
            <input className="input" value={searchValue} onChange={e => setSearchValue(e.target.value)} type="search" placeholder="Поиск..." />
        </div>
    )
}

export default Search