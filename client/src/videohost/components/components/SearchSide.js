import { useState } from "react"

const SearchSide = () => {
    const [searchValue, setSearchValue] = useState('')
    const [channelSearchValue, setChannelSearchValue] = useState('')

    const searchHandler = () => {
        window.location = `/videohost/search/${searchValue}`
    }
    const channelSearchHandler = () => {
        window.location = `/videohost/channelsearch/${channelSearchValue}`
    }

    return (
        <div className="videohost-search">
            <div>
                <input className="input" style={{marginBottom: '5px', width: '60%'}} type="search" placeholder="Поиск видео" value={searchValue} onChange={e => setSearchValue(e.target.value)} />
                <button onClick={searchHandler} className="button">Поиск</button>
            </div>
            <div>
                <input className="input" style={{width: '70%'}} type="search" placeholder="Поиск каналов" value={channelSearchValue} onChange={e => setChannelSearchValue(e.target.value)} />
                <button onClick={channelSearchHandler} className="button">Поиск</button>
            </div>
        </div>
    )
}

export default SearchSide