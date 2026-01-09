import React, { useContext, useEffect, useState } from 'react'
import api from '../../../../auth/api/auth'
import { AuthContext } from '../../../../context/AuthContext'
import '../../../styles/comment-item.css'

const CommentItem = ({item}) => {
    const auth = useContext(AuthContext)
    const [user, setUser] = useState({})
    const [isLike, setIsLike] = useState(false)
    const [likeImg, setLikeImg] = useState(require('../../../../auth/img/like_hollow_white.png'))
    const [likesCount, setLikesCount] = useState(0)

    useEffect(() => {
        const getUser = async () => {
            const response = await api.get(`/api/user/${item.user}`)
            setUser(response.data.user)
        }
        getUser()
        setLikesCount(item.likes)
        if(localStorage.getItem(item._id, auth.userId)) {
            setLikeImg(require('../../../../auth/img/like_cover_white.png'))
        }
    }, [item, auth])

    const like = async () => {
        if(!isLike && !localStorage.getItem(item._id, auth.userId)) {
            setLikeImg(require('../../../../auth/img/like_cover_white.png'))
            setLikesCount(likesCount + 1)
            setIsLike(true)
            const response = await api.get(`/api/videohost/useractions/likecomment/${item._id}`)
            console.log(response)
            localStorage.setItem(item._id, auth.userId)
        } else {
            setLikeImg(require('../../../../auth/img/like_hollow_white.png'))
            setLikesCount(likesCount - 1)
            setIsLike(false)
            const response = await api.get(`/api/videohost/useractions/dislikecomment/${item._id}`)
            console.log(response)
            localStorage.removeItem(item._id, auth.userId)
        }
    }

    const gotoCommenter = () => {
        window.location = `/user/${user._id}`
    }

  return (
    <div className="videohost-comment-item">
        <div className="videohost-comment-item-avatar">
            <img className="videohost-comment-item-avatar-img" src={process.env.REACT_APP_API_URL + '/useravatars/' + user.avatarUrl} alt="" />
            <div className="videohost-comment-item-like" onClick={like}>
                <span className="videohost-comment-item-likes-count">{likesCount}</span>
                <img className="videohost-comment-item-like-img" src={likeImg} alt=""/>
            </div>
        </div>
        <div className="videohost-comment-item-main">
            <div className="videohost-comment-item-head">
                <span onClick={gotoCommenter} className="videohost-comment-item-author" style={{cursor: 'pointer'}}>{user.name} {user.surname}</span>
                <span className="videohost-comment-item-date">{item.date}</span>
            </div>
            <div className="videohost-comment-item-text-wrapper">
                <p className="videohost-comment-item-text">{item.text}</p>
            </div>
        </div>
    </div>
  )
}

export default CommentItem
