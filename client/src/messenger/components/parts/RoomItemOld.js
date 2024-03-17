import React, { useEffect, useState } from "react"
import "../styles/room-item.css"
import api from '../../../auth/api/auth'
import useWord from "../../../common_hooks/divideWord.hook"
import Loader from "../../../common_components/Loader"
import useHighlight from "../../../common_hooks/highlight.hook"

const RoomItem = ({item, auth, isNewRoom}) => {
    const [isNotReaded, setIsNotReaded] = useState()
    const {divideWord} = useWord()
    const [user, setUser] = useState({
        avatarUrl: 'user.png',
        name: 'unnamed',
        surname: 'unname'
    })
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()
    const [fullLastMessage, setFullLastMessage] = useState({
        user: null
    })
    const gotoRoom = () => {
        window.location = `/messages/${item._id}`
    }
    
    useEffect(() => {
        const checkUsers = () => {
            api.get(`/api/newmessage/${item._id}`)
            .then(data => {
                setIsNotReaded(data.data.isNotReaded)
                api.get(`/api/getfulllastmessage/${item._id}`)
                .then(data => {
                    setFullLastMessage(data.data.fullLastMessage)
                    api.get(`/api/get2users/${item.user1}/${item.user2}`)
                    .then(data => {
                        if(data.data.user1._id && data.data.user2._id) {
                            if(data.data.user1._id === auth.userId) {
                                setUser(data.data.user2)
                                console.log(data)
                            } else {
                                setUser(data.data.user1)
                                console.log(data)
                            }
                        }
                    })
                })
            })
        }
        checkUsers()
    }, [auth])


    return (
        <>{user._id ? <div onClick={gotoRoom} style={isNewRoom ? isNotReaded && auth.userId !== fullLastMessage.user ? {display: "flex"} : {display: "none"} : {display: "flex"}} className={isNotReaded && auth.userId !== fullLastMessage.user  ? `room-item move-glow-block` : `room-item ${randomColor()} ${randomBlockShadow()}`}>
            <div className="room-item-info-wrapper">
                {user.name !== 'unnamed' ? <img className={`room-img ${randomBlockShadow()}`} width="60" src={process.env.REACT_APP_API_URL + '/useravatars/' + user.avatarUrl} alt="user" /> : <Loader ml={'0%'} />}
                {user.name !== 'unnamed' ? <div className="room-item-info">
                    <p className={`room-title ${randomColor()} ${randomShadow()}`}>{user.name} {user.surname}</p>
                    <p className="room-last-message">{divideWord(item.lastMessage, 40)}</p>
                </div> : <div className="room-item-info">Loading...</div>}
            </div>
            
        </div> : <></>}</>
    )
}

export default RoomItem