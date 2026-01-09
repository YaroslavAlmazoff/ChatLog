import { useContext, useState, useEffect } from "react"
import { ChannelContext } from "../../../context/ChannelContext"
import { AuthContext } from "../../../../../context/AuthContext"
import api from '../../../../../auth/api/auth'
import useHighlight from "../../../../../common_hooks/highlight.hook"

const ChannelBottomInfo = () => {
    const {name, id} = useContext(ChannelContext)
    const auth = useContext(AuthContext)
    const [buttonText, setButtonText] = useState('')
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()

    useEffect(() => {
        const getIsSubscriber = async () => {
            const response = await api.get(`/api/videohost/useractions/issubscriber/${id}`, {
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
    }, [auth, id])

    const subscribe = async (e) => {
        e.stopPropagation()
        const response = await api.get(`/api/videohost/useractions/subscribe/${id}`, {headers: {
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

    return (
        <div className="videohost-channel-bottom-info">
            <p className={`videohost-channel-name ${randomColor()} ${randomShadow()}`}>{name}</p><span style={{color: 'white', marginLeft: '5px'}}>|</span>
            <button onClick={subscribe} className="button">{buttonText}</button>
        </div>
    )
}

export default ChannelBottomInfo