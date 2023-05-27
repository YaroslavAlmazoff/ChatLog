import React, { useContext, useEffect, useState } from "react"
import "../styles/room-item.css"
import api from '../../../auth/api/auth'
import { AuthContext } from "../../../context/AuthContext"
import useWord from "../../../common_hooks/divideWord.hook"
import Loader from "../../../common_components/Loader"
import useHighlight from "../../../common_hooks/highlight.hook"

const ChatRoomItem = ({lastMessage, id, title, avatarUrl}) => {
    const [isNotReaded, setIsNotReaded] = useState()
    const {divideWord} = useWord()
    const [fullLastMessage, setFullLastMessage] = useState({
        user: '',
        readedThisMessage: []
    })
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()
    useEffect(() => {
        const getFullLastMessage = async () => {
            const response = await api.get(`/api/getfullchatlastmessage/${id}`)
            console.log(response)
            setFullLastMessage(response.data.fullLastMessage)
        }
        getFullLastMessage()
    }, [id])
    const auth = useContext(AuthContext)
    const gotoRoom = (id) => {
        window.location = `/chat/${id}`
    }

    const readCheck = () => {
        fullLastMessage.readedThisMessage.forEach(el => {
            console.log(auth.userId == el)
            if(auth.userId == el) {
                setIsNotReaded(false)
                return
            } else {
                setIsNotReaded(true)
            }
        })
    }

    useEffect(() => {
        if(fullLastMessage) {
            if(fullLastMessage.readedThisMessage) {
                readCheck()
            }
        }
    }, [auth,fullLastMessage])



    return (
        <div onClick={() => gotoRoom(id)} className={isNotReaded ? 'move-glow-block' : `chat-room-item ${randomColor()} ${randomBlockShadow()}`}>
            <div className="room-item-info-wrapper">
                {title ? <img className={`room-img ${randomBlockShadow()}`} width="60" src={avatarUrl ? process.env.REACT_APP_API_URL + '/chatavatars/' + avatarUrl : require('../../../auth/img/group.png')} alt="user" /> : <Loader ml={'0%'} />}
                {title ? <div className="room-item-info">
                    <p className={`room-title ${randomColor()} ${randomShadow()}`}>{title}</p>
                    <p className="room-last-message">{divideWord(lastMessage, 40)}</p>
                </div> : <div className="room-item-info">Loading...</div>}
            </div>
            
        </div>
    )
}

export default ChatRoomItem