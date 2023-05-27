import { useEffect, useState } from "react"
import api from '../../../../api/auth'
import './post-head.css'

const PublicPostHead = ({id}) => {
    const [postHead, setPostHead] = useState({})

    useEffect(() => {
        const getPostHead = async () => {
            const response = await api.get(`/api/public/posthead/${id}`)
            setPostHead(response.data)
        }
        getPostHead()
    }, [id])

    const gotoPublic = () => {
        window.location = `/public/${postHead.id}`
    }

    return (
        <div className="post-head" onClick={gotoPublic}>
            <img className="post-head-avatar" src={process.env.REACT_APP_API_URL + '/publicavatars/' + postHead.avatarUrl} alt="" />
            <span className="post-head-name">{postHead.name}</span>
        </div>
    )
}

export default PublicPostHead