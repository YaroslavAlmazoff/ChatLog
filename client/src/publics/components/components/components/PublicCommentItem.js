import {useState, useEffect, useContext} from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import api from '../../../../auth/api/auth'
import '../../../../videohost/styles/comment-item.css'

const PublicCommentItem = ({item}) => {

    const auth = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [isLike, setIsLike] = useState(false)
    const [likeImg, setLikeImg] = useState(require('../../../../img/blue-like.png'))
    const [likesCount, setLikesCount] = useState(0)

    useEffect(() => {
        const getUser = async () => {
            const response = await api.get(`/api/user/${item.user}`)
            setUser(response.data.user)
        }
        getUser()
        setLikesCount(item.likes)
        if(localStorage.getItem(item._id) === auth.userId) {
            setLikeImg(require('../../../../img/red-like.png'))
        }
    }, [item, auth])

    const like = async () => {
        if(!isLike && localStorage.getItem(item._id) !== auth.userId) {
            setLikeImg(require('../../../../img/red-like.png'))
            setLikesCount(likesCount + 1)
            setIsLike(true)
            const response = await api.get(`/api/public/likecomment/${item._id}`)
            console.log(response)
            localStorage.setItem(item._id, auth.userId)
        } else {
            setLikeImg(require('../../../../img/blue-like.png'))
            setLikesCount(likesCount - 1)
            setIsLike(false)
            const response = await api.get(`/api/public/dislikecomment/${item._id}`)
            console.log(response)
            localStorage.removeItem(item._id, auth.userId)
        }
    }

  return (
    <div className="videohost-comment-item">
        <div className="videohost-comment-item-avatar">
            <img className="videohost-comment-item-avatar-img" src={process.env.REACT_APP_API_URL + '/useravatars/' + user.avatarUrl} alt="" />
            <div onClick={like}>
                <span className="videohost-comment-item-likes-count">{likesCount}</span>
                <img className="videohost-comment-item-like-img" src={likeImg} alt=""/>
            </div>
        </div>
        <div className="videohost-comment-item-main">
            <div className="videohost-comment-item-head">
                <span className="videohost-comment-item-author">{user.name} {user.surname}</span>
                <span className="videohost-comment-item-date">{item.date}</span>
            </div>
            <div className="videohost-comment-item-text-wrapper">
                <p className="videohost-comment-item-text">{item.text}</p>
            </div>
        </div>
    </div>
  )

}

export default PublicCommentItem