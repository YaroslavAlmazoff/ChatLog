import {useContext, useEffect, useState} from 'react'
import ChannelItem from './components/ChannelItem'
import api from '../../../auth/api/auth'
import { AuthContext } from '../../../context/AuthContext'
import {Link} from 'react-router-dom'
import Loader from '../../../common_components/Loader'
import useHighlight from '../../../common_hooks/highlight.hook'

const Subscribes = () => {
    const auth = useContext(AuthContext)
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)
    const {randomColor, randomShadow} = useHighlight()

    useEffect(() => {
        const getSubscribes = async () => {
            const response = await api.get(`/api/videohost/channels/subscribes/${auth.userId}`)
            setChannels(response.data.channels)
            setLoading(false)
        }
        getSubscribes()
    }, [auth])



    return (
        <>
            <div className="videohost-text-left-wrap">
                <span className={`videohost-title ${randomColor()} ${randomShadow()}`}>Подписки | <Link className="videohost-link" to="/videohost/subscribes">Все</Link></span>
            </div>
            <div className="videohost-main-subscribes">
                {
                    !loading ? channels.map(item => <ChannelItem item={item} width={'25%'} />) : <Loader ml={'50%'} />
                }
            </div>
        </>
    )
}

export default Subscribes