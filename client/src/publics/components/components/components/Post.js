import {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../../../../context/AuthContext'
import api from '../../../../auth/api/auth'
import PublicCommentField from './PublicCommentField'
import PublicCommentItem from './PublicCommentItem'
import { useParams } from 'react-router'
import { LIKE_NOTIFICATION } from '../../../../publicNotificationTypes'

const Post = ({item, isAdmin, deletePost}) => {
    const auth = useContext(AuthContext)
    const params = useParams()
    const [image, setImage] = useState('')
    const [mainImageLoading, setMainImageLoading] = useState(true)
    const [commentsDisplay, setCommentsDisplay] = useState(false)
    const [comments, setComments] = useState([])
    const [colors] = useState([
        'color-neon-blue',
        'color-neon-orange',
        'color-neon-green',
        'color-neon-purple',
        'color-neon-pink',
        'color-neon-navy',
    ])
    const [shadows] = useState([
        'blue-text-glow',
        'orange-text-glow',
        'green-text-glow',
        'purple-text-glow',
        'pink-text-glow',
        'navy-text-glow',
    ])

    const randomColor = () => {
        return colors[Math.round(Math.random() * colors.length)]
    }
    const randomShadow = () => {
        return shadows[Math.round(Math.random() * colors.length)]
    }

    useEffect(() => {
        setImage(process.env.REACT_APP_API_URL + '/publicposts/' + item.images[0])
    }, [item])

    useEffect(() => {
        const getComments = async () => {
            const response = await api.get(`/api/public/comments/${item._id}`)
            setComments(response.data.comments.reverse())
        }
        getComments()
        setLikesCount(item.likes)
    }, [item])

    useEffect(() => {
        if(localStorage.getItem(item._id) === auth.userId) {
            setLike(require('../../../../img/red-like.png'))
        }
        document.querySelector("body").scrollTop = document.querySelector("body").scrollTop + 100
    }, [item, auth])

    const [like, setLike] = useState(require('../../../../img/blue-like.png'))
    const [likesCount, setLikesCount] = useState()

    const mark = async () => {
        await api.post(`/api/public/notify/${item._id}/${params.id}`, {type: LIKE_NOTIFICATION}, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        if(like === require('../../../../img/blue-like.png')) {
            localStorage.setItem(item._id, auth.userId)
            setLikesCount(likesCount + 1)
            setLike(require('../../../../img/red-like.png'))
            await api.get(`/api/public/likepost/${item._id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
        } else {
            localStorage.removeItem(item._id, auth.userId)
            setLikesCount(likesCount - 1)
            setLike(require('../../../../img/blue-like.png'))
            await api.get(`/api/public/likepost/${item._id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }}) 
        }   
    } 

    const toggleCommentsDisplay = () => {
        if(commentsDisplay) {
            setCommentsDisplay(false)
        } else {
            setCommentsDisplay(true)
        }
    }

    return (
        <div className="public-post">
            {isAdmin &&
                <div className="public-post-delete"><span title="Удалить статью?" onClick={() => deletePost(item._id)} className="public-post-delete">&times;</span></div>
            }
            <h2 className={`public-post-title ${randomColor()} ${randomShadow()}`}>{item.title}</h2>
            <p className={`public-post-text ${randomColor()} ${randomShadow()}`}>{item.text}</p>
            {item.images.length ? <img onLoad={() => setMainImageLoading(false)} className="public-post-image" src={image} alt="ad" style={!mainImageLoading ? {display: 'block'} : {display: 'none'}} /> : null}
            <div className="public-post-images">
                {item.images.length > 1 && item.images.map(el => <img 
                    style={process.env.REACT_APP_API_URL + '/publicposts/' + el === image ? {border: '1px solid rgb(0, 140, 255)'} : {border: 'none'}} 
                    onClick={() => setImage(process.env.REACT_APP_API_URL + '/publicposts/' + el)} 
                    className="public-post-small-image" 
                    src={process.env.REACT_APP_API_URL + '/publicposts/' + el} 
                    alt="foto" 
                />)}
                {likesCount > 0 ? <span style={{color: 'white'}}>{likesCount}</span> : null}
                <img onClick={mark} className="user-post-like" src={like} alt="" />
                {comments.length ? <span style={{color: 'white'}}>{comments.length}</span> : null}
                <img onClick={toggleCommentsDisplay} className="user-post-like" src={require('../../../../img/comment.png')} alt="" />
            </div>
            <p className="public-post-date">От {item.date}</p>
            {
            commentsDisplay && 
            <div>
                <PublicCommentField id={item._id} comments={comments} setComments={setComments} publicID={params.id} />
                {comments.map(item => <PublicCommentItem item={item} />)}
            </div>
            }
        </div>
    )
}

export default Post