import { useEffect, useState } from 'react'
import {useParams} from 'react-router'
import api from '../../../auth/api/auth'
import VideoItem from './components/VideoItem'
import Loader from '../../../common_components/Loader'

const ChannelVideos = () => {
    const params = useParams()
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getVideos = async () => {
            const response = await api.get(`/api/videohost/videos/channelvideos/${params.id}`)
            setVideos(response.data.videos)
            setLoading(false)
        }
        getVideos()
    }, [params])

    return (
        <>
        {
            !loading ? 
            <div className="videohost-channel-videos">
                {videos.length !== 0 ? videos.map(item => <VideoItem item={item} width={window.innerWidth > 500 ? '20%' : '94%'} />) : <p style={{color: 'white'}}>На канале нет видео</p>}
            </div>
            : <Loader ml={'50%'} />
        }
        
        </> 
    )
}

export default ChannelVideos