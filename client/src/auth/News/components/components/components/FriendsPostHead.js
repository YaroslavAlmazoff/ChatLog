import { useEffect, useState } from "react"
import api from '../../../../api/auth'
import './post-head.css'

const FriendsPostHead = ({id}) => {
    const [postHead, setPostHead] = useState({})

    useEffect(() => {
        const getPostHead = async () => {
            const response = await api.get(`/api/posthead/${id}`)
            setPostHead(response.data)
        }
        getPostHead()
    }, [id])

    const gotoFriend = () => {
        window.location = `/user/${postHead.id}`
    }

    return (
        <div className="post-head" onClick={gotoFriend}>
            <img className="post-head-avatar" src={process.env.REACT_APP_API_URL + '/useravatars/' + postHead.avatarUrl} alt="" />
            <span className="post-head-name">{postHead.name} {postHead.surname}</span>
        </div>
    )
}

export default FriendsPostHead