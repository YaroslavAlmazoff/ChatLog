import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import api from '../../../auth/api/auth'
import { AuthContext } from "../../../context/AuthContext"
import VideoMiddleSide from "./components/VideoMiddleSide"
import Comments from '../components/Comments'

const VideoFrame = ({video}) => {
    const auth = useContext(AuthContext)
    const params = useParams()
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLike, setIsLike] = useState(false)
    const [likeImg, setLikeImg] = useState(require('../../../auth/img/like_hollow_white.png'))
    const [likesCount, setLikesCount] = useState(0)

    useEffect(() => {
        if(!params.id) return
        if(!auth.userId) return
        const getIsAdmin = async () => {
            const response = await api.get(`/api/videohost/videos/isadmin/${params.id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setIsAdmin(response.data.isAdmin)
            console.log(response)
        }
        getIsAdmin()
        setLikesCount(video.likes)
        if(localStorage.getItem(video._id, auth.userId)) {
            setLikeImg(require('../../../auth/img/like_cover_white.png'))
        }
    }, [params, video, auth])

    const like = async () => {
        if(!isLike) {
            setLikeImg(require('../../../auth/img/like_cover_white.png'))
            setLikesCount(likesCount + 1)
            setIsLike(true)
            const response = await api.get(`/api/videohost/useractions/likevideo/${video._id}`)
            console.log(response)
            localStorage.setItem(video._id, auth.userId)
        } else {
            setLikeImg(require('../../../auth/img/like_hollow_white.png'))
            setLikesCount(likesCount - 1)
            setIsLike(false)
            const response = await api.get(`/api/videohost/useractions/dislikevideo/${video._id}`)
            console.log(response)
            localStorage.removeItem(video._id, auth.userId)
        }
    }

    return (
        <div className="videohost-video-frame">
            <p className="videohost-video-title">{video.title}</p>
            <video className="videohost-video-frame-video" controls src={process.env.REACT_APP_API_URL + '/videohostvideos/' + video.videoUrl}></video>
            <div className="videohost-video-info">
                <span style={{color: 'white', fontSize: '16pt'}}>{video.title}</span>
                <div className="videohost-video-info-top">
                    <div className="videohost-video-like" onClick={like}>
                        <span className="videohost-video-likes-count">{likesCount}</span>
                        <img className="videohost-video-like-img" src={likeImg} alt=""/>
                    </div>
                    <span className="videohost-video-views">{video.views} <img width="30" src={require('../../img/eye.png')} alt="" /></span>
                </div>
            </div>
            {isAdmin && <VideoMiddleSide />}
            <Comments />
        </div>
    )
}

export default VideoFrame