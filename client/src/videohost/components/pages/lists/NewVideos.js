import { useEffect, useState, useMemo } from "react"
import VideoItem from '../../components/components/VideoItem'
import api from '../../../../auth/api/auth'
import useDate from '../../../../common_hooks/date.hook'
import Search from "../../components/components/components/components/Search"
import '../../../styles/list.css'
import Navigation from "../../components/Navigation"
import NoVideos from "../../components/NoVideos"
import Loader from "../../../../common_components/Loader"
import useVerify from "../../../../common_hooks/verify.hook"
import useHighlight from "../../../../common_hooks/highlight.hook"

const NewVideos = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const {randomColor, randomShadow} = useHighlight()
    const [videos, setVideos] = useState([])
    const {getCurrentDate} = useDate()
    const [searchValue, setSearchValue] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getVideos = async () => {
            const date = getCurrentDate()
            const response = await api.get(`/api/videohost/videos/new/${date}`)
            setVideos(response.data.videos)
            setLoading(false)
        }
        getVideos()
    }, [])

    const searchedVideos = useMemo(() => {
        return [...videos].filter(el => {
            return el.title.toLowerCase().includes(searchValue.toLowerCase()) || 
            el.description.toLowerCase().includes(searchValue.toLowerCase()) ||
            searchValue === ''
        })
    }, [videos, searchValue])

    return (
        <div className="videohost-list-page block">
            <Navigation />
            <span className={`videohost-title ${randomColor()} ${randomShadow()}`}>Новые видео по Вашим предпочтениям</span>
            <Search searchValue={searchValue} setSearchValue={setSearchValue} />
            <div className="videohost-list">
            {
                searchedVideos.map(item => <VideoItem item={item} width={window.innerWidth > 500 ? '20%' : '94%'} />)
            }
            </div>
            <NoVideos videos={videos} />
        </div>
    )
}

export default NewVideos