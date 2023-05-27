import { useContext, useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import api from '../../../auth/api/auth'
import { AuthContext } from '../../../context/AuthContext'
import '../../styles/photo-card.css'

const PhotoCard = ({item}) => {
    const auth = useContext(AuthContext)
    const [likes, setLikes] = useState(0)
    const [likeImg, setLikeImg] = useState(require('../../img/blue.png'))
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(localStorage.getItem(item._id) === 'liked') {
            setLikeImg(require('../../img/red.png'))
        } 
        const getLikes = async () => {
            const response = await api.get(`/api/photo/getlikes/${item._id}`)
            setLikes(response.data.likes)
        }
        getLikes()
    }, [item])

    const like = async (e) => {
        e.stopPropagation()
        if(localStorage.getItem(item._id) === 'liked') {
            return
        }
        localStorage.setItem(item._id, 'liked')
        setLikeImg(require('../../img/red.png'))
        await api.post(`/api/photo/setlikes/${item._id}/${auth.userId}`, {likes: likes + 1})
        setLikes(prev => prev + 1)
    }
    const gotoPhoto = () => {
        window.location = `/photo/${item._id}`
    }

    return (
        <div className="photo-card" onClick={gotoPhoto}>
            <img className='photo-img' src={process.env.REACT_APP_API_URL + `/photos/${item.name}`} alt="ph" />
            <div onClick={(e) => like(e)} className='photo-card-like-wrap' style={{border: 'none'}}>
                <img onLoad={() => setLoading(false)} className='photo-like-img' src={likeImg} alt="like" style={loading ? {display: 'none'} : {display: 'block'}} />
                <span style={{position: 'absolute', color: 'white', marginTop: '0px', marginLeft: '-17px'}}>{likes}</span>
            </div>
            <div className="photo-info">
                <p className="photo-name">{item.title}</p>
                <p className="photo-author">Автор: <Link className='photo-author-link' to={`/user/${item.authorId}`}>{item.authorName} {item.authorSurname}</Link></p>
            </div>
        </div>
    )
}

export default PhotoCard