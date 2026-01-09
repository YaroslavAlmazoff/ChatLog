import { useEffect, useState } from 'react'
import {useParams} from 'react-router'
import api from '../../../auth/api/auth'
import RecommendedVideosVideoPage from '../components/RecomendedVideosVideoPage'
import SameVideos from '../components/SameVideos'
import VideoFrame from '../components/VideoFrame'
import '../../styles/video.css'
import Navigation from '../components/Navigation'
import Loader from '../../../common_components/Loader'
import useVerify from '../../../common_hooks/verify.hook'

const Video = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const params = useParams()
    const [video, setVideo] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getVideo = async () => {
            const response = await api.get(`/api/videohost/videos/video/${params.id}`)
            setVideo(response.data.video)
            setLoading(false)
        }
        getVideo()
    }, [params])
    useEffect(() => { 
        if(!video._id) {
            return
        }
        const view = async () => {
            const response = await api.get(`/api/videohost/useractions/view/${video._id}`)
            console.log(response)
        }
        view()
    }, [video])

    return (
        <div className="videohost-video">
            <Navigation />
            {!loading ? <div className="videohost-video-content">
                <RecommendedVideosVideoPage />
                <VideoFrame video={video} />
                <SameVideos category={video ? video.category : 'default'} />
            </div> : <Loader ml={'50%'} />}
            
        </div>
    )
}

export default Video