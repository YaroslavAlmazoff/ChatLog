import { useEffect, useState } from "react"
import api from '../../../../auth/api/auth'
import '../../../styles/subscribers.css'

const Subscriber = ({id}) => {
    const [subscriber, setSubscriber] = useState({name: '', avatarUrl: ''})

    useEffect(() => {
        const getSubscriber = async () => {
            const response = await api.get(`/api/user/${id}`)
            setSubscriber(response.data.user)
        }
        getSubscriber()
    }, [id])

    const gotoSubscriber = () => {
        window.location = `/user/${id}`
    }
    
    return (
        <div className="public-subscriber" onClick={gotoSubscriber}>
            <img className="public-subscriber-avatar" src={process.env.REACT_APP_API_URL + `/useravatars/` + subscriber.avatarUrl} alt="avatar" />
            <span className="public-subscriber-name">{subscriber.name}</span>
        </div>
    )
}

export default Subscriber