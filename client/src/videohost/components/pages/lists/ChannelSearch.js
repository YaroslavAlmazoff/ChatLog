import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router"
import api from '../../../../auth/api/auth'
import VideoItem from "../../components/components/VideoItem"
import '../../../styles/main.css'
import '../../../styles/list.css'
import Navigation from "../../components/Navigation"
import NoVideos from "../../components/NoVideos"
import Loader from "../../../../common_components/Loader"
import useVerify from "../../../../common_hooks/verify.hook"
import ChannelItem from "../../components/components/ChannelItem"
import NoChannels from "../../components/NoChannels"
import useHighlight from "../../../../common_hooks/highlight.hook"

const ChannelSearch = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const params = useParams()
    const [channels, setChannels] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)

    const {randomColor, randomShadow} = useHighlight()

    useEffect(() => {
        const getVideos = async () => {
            setSearchValue(params.search)
            const response = await api.get('/api/videohost/channels/all')
            setChannels(response.data.channels)
            setLoading(false)
        }
        getVideos()
    }, [params])

    const searchedChannels = useMemo(() => {
        return [...channels].filter(
            item => item.name.toLowerCase().includes(searchValue.toLowerCase()) || 
            item.description.toLowerCase().includes(searchValue.toLowerCase()) || 
            item.category.toLowerCase().includes(searchValue.toLowerCase()))
    }, [channels, searchValue])

    return (
        <div className="videohost-list-page block">
            <Navigation />
            <div className="videohost-search">
                <input className="input" value={searchValue} onChange={e => setSearchValue(e.target.value)} type="text" placeholder="Поиск..." />
            </div>
            
            <div className="videohost-list-videos">
                {channels.length ? <div className="videohost-list" style={{width: '100%'}}>
                {
                    searchedChannels.map(item => <ChannelItem item={item} width={window.innerWidth > 500 ? '20%' : '94%'} />)
                }
                </div> : <Loader ml={'50%'} />}
            <NoChannels channels={searchedChannels} />
            </div>
        </div>
    )
}

export default ChannelSearch