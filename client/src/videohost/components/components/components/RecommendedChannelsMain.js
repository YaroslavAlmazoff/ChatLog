import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../../../../context/AuthContext"
import api from '../../../../auth/api/auth'
import ChannelItem from "./ChannelItem"
import Loader from "../../../../common_components/Loader"

const RecommendedChannelsMain = () => {
    const auth = useContext(AuthContext)
    const [channels, setChannels] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!auth.userId) return 
        const getChannels = async () => {
            const response = await api.get(`/api/videohost/channels/recommendedmain/${auth.userId}`)
            setChannels(response.data.channels)
            setLoading(false)
        }
        getChannels()
    }, [auth])

    return (
        <div className="videohost-main-recommended-channels" style={channels.length ? {borderLeft: '1px solid rgb(83, 83, 83)'} : {border: 'none'}}>
            {
                !loading ? <>{channels.length ? channels.map(item => <ChannelItem item={item} width={'84%'} />) : <div style={window.innerWidth < 500 ? {marginLeft: '20px'} : {marginLeft: 'auto'}}><p className="videohost-title-small">Нет каналов</p></div>}</> : <Loader ml={'50%'} />
            }
        </div>
    )
}

export default RecommendedChannelsMain