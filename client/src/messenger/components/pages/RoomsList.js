import React, { useContext, useEffect, useState } from "react"
import useRandom from '../../../common_hooks/random.hook'
import RoomItem from "../parts/RoomItem"
import "../styles/room-list.css"
import api from '../../../auth/api/auth'
import { AuthContext } from "../../../context/AuthContext"
import ShowAdLeft from "../../../inner_ad/components/components/ShowAdLeft"
import ShowAdRight from "../../../inner_ad/components/components/ShowAdRight"
import Loader from "../../../common_components/Loader"
import useVerify from "../../../common_hooks/verify.hook"
import ChatRoomItem from "../parts/ChatRoomItem"

export const RoomsList = () => {
    const auth = useContext(AuthContext)
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const {randomKey} = useRandom()
    const [rooms, setRooms] = useState([])
    const [chatRooms, setChatRooms] = useState([])
    const [newRooms, setNewRooms] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if(!auth.userId) return
        const getRooms = async () => {
            setLoading(true)
            const newRoomsResponse = await api.get(`/api/getnewrooms`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setNewRooms(newRoomsResponse.data.rooms)
            const response = await api.get(`/api/getrooms`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setRooms(response.data.rooms)
            const response2 = await api.get(`/api/getchatrooms`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            console.log(response)
            setChatRooms(response2.data.rooms)
            console.log(response)
            setLoading(false)
        }
        getRooms()
    }, [auth])

    const createChat = () => {
        window.location = '/createchat'
    }

    return (
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>
            <div className="room-list">
                <h1>Сообщения</h1>
                <button onClick={createChat} className="messenger-button">+ Создать беседу</button>
                <div className="rooms-list-wrapper">
                    <span className="white-glow-text" style={{marginBottom: "10px"}}>Непрочитанные</span>
                    {!loading ? newRooms.map(el => <RoomItem 
                        key={randomKey()}
                        item={el}
                        id={auth.userId}
                        isNewRoom={true}
                        auth={auth}
                    />): <Loader ml={'50%'} />}
                    <span className="white-glow-text" style={{marginBottom: "10px"}}>Беседы</span>
                    {!loading ? chatRooms.map(el => <ChatRoomItem
                        key={randomKey()}
                        lastMessage={el.lastMessage}
                        id={el._id}
                        title={el.title}
                        avatarUrl={el.avatarUrl}
                    />): <Loader ml={'50%'} />}
                    <span className="white-glow-text" style={{marginBottom: "10px"}}>Все личные</span>
                    {!loading ? rooms.map(el => <RoomItem 
                        key={randomKey()}
                        item={el}
                        isNewRoom={false}
                        id={auth.userId}
                        auth={auth}
                    />): <Loader ml={'50%'} />}
                </div>
            </div>
        </div>
        
    )
}