import { useContext, useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import { AuthContext } from "../../../context/AuthContext"
import VideoItem from "./components/VideoItem"
import Loader from '../../../common_components/Loader'

const RecommendedVideosMain = () => {
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


    return (
        <div className="videohost-main-recommended-videos">
            <p style={{color: 'white', fontSize: '16pt'}}></p>
            {!loading ? <>{videos.length ? videos.map(item => <VideoItem item={item} width={window.innerWidth > 500 ? '23%' : '94%'} />) : <p className="videohost-title-small" style={{marginLeft: '20px'}}>Нет видео</p>}</> : <Loader ml={'50%'} /> }
        </div>
    )
}

export default RecommendedVideosMain