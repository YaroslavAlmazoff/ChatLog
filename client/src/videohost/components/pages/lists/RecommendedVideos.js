import { useContext, useEffect, useState, useMemo } from "react"
import VideoItem from '../../components/components/VideoItem'
import api from '../../../../auth/api/auth'
import {AuthContext} from '../../../../context/AuthContext'
import '../../../styles/list.css'
import Search from "../../components/components/components/components/Search"
import Navigation from "../../components/Navigation"
import NoVideos from "../../components/NoVideos"
import Loader from "../../../../common_components/Loader"
import useVerify from "../../../../common_hooks/verify.hook"
import useHighlight from "../../../../common_hooks/highlight.hook"

const RecommendedVideos = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const {randomColor, randomShadow} = useHighlight()
    const [searchValue, setSearchValue] = useState('')

    const auth = useContext(AuthContext)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!auth.userId) return 
        const getVideos = async () => {
            const response = await api.get(`/api/videohost/videos/recommendedmain/${auth.userId}`)
            setVideos(response.data.videos)
            setLoading(false)
        }
        getVideos()
    }, [auth])

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
            <span className={`videohost-title ${randomColor()} ${randomShadow()}`}>Рекомендованные видео</span>
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

export default RecommendedVideos