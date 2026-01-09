import { useContext, useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import Loader from "../../../common_components/Loader"
import { AuthContext } from "../../../context/AuthContext"
import VideoItem from "./components/VideoItem"

const RecommendedVideosVideoPage = () => {
    const auth = useContext(AuthContext)
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!auth.userId) return 
        const getVideos = async () => {
            const response = await api.get(`/api/videohost/videos/recommendedvideopage/${auth.userId}`)
            setVideos(response.data.videos)
            setLoading(false)
            console.log(response)
        }
        getVideos()
    }, [auth])


    return (
        <div className="videohost-recommended-videos-video-page">
            <p style={{color: 'white', fontSize: '16pt'}}>Рекомендованное</p>
            {!loading ? videos.map(item => <VideoItem item={item} width={'85%'} />) : <Loader ml={'50%'} />}
        </div>
    )
}

export default RecommendedVideosVideoPage