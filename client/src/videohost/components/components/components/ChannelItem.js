import { useContext, useEffect, useState } from 'react'
import '../../../styles/channel-item.css'
import api from '../../../../auth/api/auth'
import { AuthContext } from '../../../../context/AuthContext'
import useSubscribers from '../../../hooks/subscribers.hook'
import useHighlight from '../../../../common_hooks/highlight.hook'

const ChannelItem = ({item, width}) => {
    const {declination} = useSubscribers()
    const auth = useContext(AuthContext)
    const [buttonText, setButtonText] = useState('')
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()

    useEffect(() => {
        const getIsSubscriber = async () => {
            const response = await api.get(`/api/videohost/useractions/issubscriber/${item._id}`, {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            if(response.data.isSubscriber) {
                setButtonText('Отписаться')
            } else {
                setButtonText('Подписаться')
            }
        }
        getIsSubscriber()
    }, [auth, item])

    const subscribe = async (e) => {
        e.stopPropagation()
        const response = await api.get(`/api/videohost/useractions/subscribe/${item._id}`, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        if(response.data.isSubscriber) {
            setButtonText('Отписаться')
        } else {
            setButtonText('Подписаться')
        }
        console.log(response)
        window.location.reload()
    }
    const gotoChannel = () => {
        window.location = `/videohost/channel/${item._id}`
    }

    return (
        <div className="videohost-channel-item" onClick={gotoChannel} style={{width}}>
            <img className={`videohost-channel-item-preview ${randomBlockShadow()}`} src={process.env.REACT_APP_API_URL + '/channelavatars/' + item.avatarUrl} alt="" />
            <span className={`videohost-channel-item-title ${randomShadow()} ${randomColor()}`}>{item.name}</span>
            <span className='videohost-channel-item-subscribers'>{declination(item.subscribers.length)}</span>
            <button className='button' style={{marginLeft: '10px', marginTop: '10px'}} onClick={(e) => subscribe(e)}>{buttonText}</button>
        </div>
    )
}

export default ChannelItem