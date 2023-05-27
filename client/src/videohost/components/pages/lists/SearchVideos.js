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
import useHighlight from "../../../../common_hooks/highlight.hook"

const SearchVideos = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const params = useParams()
    const [videos, setVideos] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)
    const {randomColor, randomShadow} = useHighlight()

    useEffect(() => {
        const getVideos = async () => {
            setSearchValue(params.search)
            const response = await api.get('/api/videohost/videos/all')
            setVideos(response.data.videos)
            setLoading(false)
        }
        getVideos()
    }, [params])

    const searchedVideos = useMemo(() => {
        return [...videos].filter(
            item => item.title.toLowerCase().includes(searchValue.toLowerCase()) || 
            item.description.toLowerCase().includes(searchValue.toLowerCase()) || 
            item.category.toLowerCase().includes(searchValue.toLowerCase()))
    }, [videos, searchValue])

    return (
        <div className="videohost-list-page">
            <Navigation />
            <div className="videohost-search">
                <input className="input" value={searchValue} onChange={e => setSearchValue(e.target.value)} type="text" placeholder="Поиск..." />
            </div>
            
            <div className="videohost-list-videos">
                <div className="videohost-list" style={{width: '100%'}}>
                {
                    searchedVideos.map(item => <VideoItem item={item} width={window.innerWidth > 500 ? '20%' : '94%'} />)
                }
                </div>
            <NoVideos videos={searchedVideos} />
            </div>
        </div>
    )
}

export default SearchVideos