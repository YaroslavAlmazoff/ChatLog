import '../styles/main.css'

const Head = ({searchValue, setSearchValue}) => {

    const goCreate = () => {
        window.location = '/ad/create'
    }
    const search = () => {
        window.location = `/ad/search`
    }

    return (
        <div className="ads-main-head">
            <div className="ads-main-head-top">
                <p className="ads-main-title">ChatLog Объявления</p>
                <button onClick={search} className="ads-main-button">Поиск объявлений</button>
            </div>
            <div className="ads-main-buttons">
                <button onClick={goCreate} className="ads-main-button">Разместить</button>
            </div>
        </div>
    )
}

export default Head