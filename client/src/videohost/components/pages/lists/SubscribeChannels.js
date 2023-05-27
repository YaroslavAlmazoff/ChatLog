import {useContext, useEffect, useState} from 'react'
import ChannelItem from '../../components/components/ChannelItem'
import api from '../../../../auth/api/auth'
import { AuthContext } from '../../../../context/AuthContext'
import '../../../styles/list.css'
import '../../../styles/main.css'
import Navigation from '../../components/Navigation'
import Loader from '../../../../common_components/Loader'
import useVerify from '../../../../common_hooks/verify.hook'
import useHighlight from '../../../../common_hooks/highlight.hook'

const SubscribeChannels = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const auth = useContext(AuthContext)
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const {randomColor, randomShadow} = useHighlight()

    useEffect(() => {
        const getSubscribes = async () => {
            const response = await api.get(`/api/videohost/channels/allsubscribes/${auth.userId}`)
            setChannels(response.data.channels)
            setLoading(false)
        }
        getSubscribes()
    }, [auth])

    return (
        <div className="videohost-list-page block">
            <Navigation />
            <span className={`videohost-title ${randomColor()} ${randomShadow()}`}>Подписки</span>
            <div className="videohost-main-subscribes">
                {
                    channels.map(item => <ChannelItem item={item} width={'25%'} />)
                }
            </div>
        </div>
    )
}

export default SubscribeChannels