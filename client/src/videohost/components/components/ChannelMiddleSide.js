import { useEffect, useState } from "react"
import { useParams } from "react-router"
import api from '../../../auth/api/auth'
import useHighlight from "../../../common_hooks/highlight.hook"
import useSubscribers from "../../hooks/subscribers.hook"

const ChannelMiddleSide = () => {
    const params = useParams()
    const [videosCount, setVideosCount] = useState(0)
    const [subscribers, setSubscribers] = useState('0')
    const {declination} = useSubscribers()
    const {randomColor, randomShadow} = useHighlight()

    useEffect(() => {
        const getVideosCount = async  () => {
            const response = await api.get(`/api/videohost/videos/videoscount/${params.id}`)
            setVideosCount(response.data.count)
        }
        getVideosCount()
        const getSubscribersCount = async () => {
            const response = await api.get(`/api/videohost/channels/subscriberscount/${params.id}`)
            setSubscribers(response.data.subscribers)
            console.log(response)
        }
        getSubscribersCount()
    }, [params])

    return (
        <div className="videohost-channel-middle-side">
            <p className={`videohost-channel-middle-info ${randomColor()} ${randomShadow()}`}>{videosCount} видео</p>
            <p className={`videohost-channel-middle-info ${randomColor()} ${randomShadow()}`}>{declination(subscribers)}</p>
        </div>
    )
}

export default ChannelMiddleSide