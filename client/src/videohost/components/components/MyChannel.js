import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import api from '../../../auth/api/auth'
import '../../styles/form.css'
import '../../styles/my-channel.css'
import useHighlight from "../../../common_hooks/highlight.hook"

const MyChannel = () => {
    const auth = useContext(AuthContext)

    const [myChannel, setMyChannel] = useState({
        name: '',
        avatarUrl: ''
    })
    const [myChannelDisplay, setMyChannelDisplay] = useState('')

    useEffect(() => {
        if(!auth.userId) return
        const getChannel = async () => {
            const response = await api.get(`/api/videohost/channels/channelbyadmin/${auth.userId}`)
            if(response.data.channel) {
                setMyChannel(response.data.channel)
                setMyChannelDisplay('flex')
            } else {
                setMyChannelDisplay('none')
            }
        } 
        getChannel()
    }, [auth])

    const gotoMyChannel = () => {
        window.location = `/videohost/channel/${myChannel._id}`
    }
    const {randomColor, randomShadow} = useHighlight()

    return (
        <>
        {myChannel ? <div onClick={gotoMyChannel} className="videohost-my-channel block" style={{display: myChannelDisplay}}>
            <div className="videohost-my-channel-left">
                <div className="videohost-my-channel-avatar-wrap">{myChannel.avatarUrl && <img src={process.env.REACT_APP_API_URL + '/channelavatars/' + myChannel.avatarUrl} className="videohost-my-channel-avatar" alt="" />}</div>
                <p className="videohost-my-channel-title">{myChannel.name}</p>
            </div>
            <p style={{color: 'white', marginRight: '15px'}} className={`${randomColor()} ${randomShadow()}`}>Ваш канал</p>
        </div> : 
        <div>
            <button className="button">Создать канал</button>
        </div>}
        </>
    )
}

export default MyChannel