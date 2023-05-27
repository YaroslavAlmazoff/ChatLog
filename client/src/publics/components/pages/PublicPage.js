import {useState, useEffect, useContext} from 'react'
import api from '../../../auth/api/auth'
import {useParams} from 'react-router'
import Head from '../components/Head'
import Subscribers from '../components/Subscribers'
import Posts from '../components/Posts'
import '../../styles/public.css'
import { AuthContext } from '../../../context/AuthContext'
import Notifications from '../components/Notifications'

const PublicPage = () => {
    const params = useParams()
    const auth = useContext(AuthContext)
    const [pub, setPub] = useState({})
    const [subscribers, setSubscribers] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [isNotifications, setIsNotifications] = useState(false)

    useEffect(() => {
        const getPublic = async () => {
            console.log(params.id)
            const response = await api.get(`/api/public/public/${params.id}`)
            setPub(response.data.pub)
            setIsAdmin(auth.userId === response.data.pub.admin)
        }
        getPublic()
    }, [params, auth])

    return (
        <div className="public">
            <Head pub={pub} isAdmin={isAdmin} subscribers={subscribers} setSubscribers={setSubscribers} isNotifications={isNotifications} setIsNotifications={setIsNotifications} />
            {isNotifications && <Notifications />}
            <Subscribers pub={pub} subscribers={subscribers} setSubscribers={setSubscribers} />
            <Posts pub={pub} isAdmin={isAdmin} />
        </div>
    )
}

export default PublicPage