import { useEffect, useState } from "react"
import api from '../auth/api/auth'
import Message from "./Message"
import './admin.css'
import { useParams } from "react-router"
import useVerify from "../common_hooks/verify.hook"
import AddEvent from "./AddEvent"
import AddImage from "./AddImage"
import AddBIN from "./AddBIN"

const Admin = () => {
    const params = useParams()
    const {verify} = useVerify()
    const [messages, setMessages] = useState([])
    const [visits, setVisits] = useState(0)

    useEffect(() => {
        if(params.id !== '628e5aab0153706a3e18fe79') {
            window.location = '/home'
        }
        verify()
    }, [])
    useEffect(() => {
        const getVisits = async () => {
            const response = await api.get('/api/admin/visits')
            setVisits(response.data.visits)
        } 
        const getMessages = async () => {
            const response = await api.get('/api/admin/messages')
            setMessages(response.data.messages)
        }
        getMessages()
        getVisits()
    }, [])

    return (
        <div className="admin">
            <div className="admin-messages block">
                <div>
                    {messages.map(item => <Message item={item} />)}
                </div>
            </div>
            <div className="admin-visits">
                <h3 className="admin-visits-text">{visits} человек послетило ChatLog.ru за все время 
                существования этой чудесной социальной сети.</h3>
                <span className="text-glow" style={{color:"white"}}>Астрономические события</span>
                <AddEvent />
                <AddImage />
                <AddBIN />
            </div>
        </div>
    )
}

export default Admin