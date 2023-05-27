import {useEffect, useState} from 'react'
import api from '../../../auth/api/auth'
import Loader from '../../../common_components/Loader'
import VideoItem from '../components/components/VideoItem'

const SameVideos = ({category}) => {
    const [videos, setVideos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getVideos = async () => {
            const response = await api.post('/api/videohost/videos/same', {category})
            setVideos(response.data.videos)
            setLoading(false)
        }
        getVideos()
    }, [category])

    return (
        <div className="videohost-same-videos">
            <p style={{color: 'white', fontSize: '16pt'}}>Похожие видео</p>
            <div className="videohost-same-videos-list">
                {!loading ? videos.map(item => <VideoItem item={item} width={'85%'} />) : <Loader ml={'50%'} />}
            </div>
        </div>
    )
}

export default SameVideos