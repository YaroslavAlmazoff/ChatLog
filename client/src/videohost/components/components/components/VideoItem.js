import { useEffect, useState } from 'react'
import '../../../styles/video-item.css'
import api from '../../../../auth/api/auth'
import Loader from '../../../../common_components/Loader'
import useHighlight from '../../../../common_hooks/highlight.hook'

const VideoItem = ({item, width}) => {
    const [author, setAuthor] = useState('')
    const [loading, setLoading] = useState(true)
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()

    useEffect(() => {
        const getAuthor = async () => {
            const response = await api.get(`/api/videohost/videos/author/${item.channel}`)
            setAuthor(response.data.name)
            setLoading(false)
        }
        getAuthor()
    }, [item])
    const gotoVideo = () => {
        window.location = `/videohost/video/${item._id}`
    }
    const gotoChannel = (e) => {
        e.stopPropagation()
        window.location = `/videohost/channel/${item.channel}`
    }

    return (
        <>{!loading ? 
        <div onClick={gotoVideo} className="videohost-video-item" style={{width}}>
            <img className={`videohost-video-item-preview ${randomBlockShadow()}`} src={process.env.REACT_APP_API_URL + '/videopreviews/' + item.previewUrl} alt="" />
            <div className="videohost-video-item-text-block"><span onClick={gotoChannel} className={`videohost-video-item-author space ${randomColor()} ${randomShadow()}`}>{author}</span></div>
            <div className="videohost-video-item-text-block"><span className={`videohost-video-item-title space ${randomColor()} ${randomShadow()}`}>{item.title}</span></div>
        </div> : <Loader ml={'50%'} />}
        </>
    )
}

export default VideoItem