import { useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import PhotoCard from "../components/PhotoCard"
import useDate from "../../../common_hooks/date.hook"
import '../../styles/photo-list.css'
import { Link } from "react-router-dom"
import Loader from "../../../common_components/Loader"
import useVerify from "../../../common_hooks/verify.hook"

const New = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const {getCurrentDate} = useDate()
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getPhotos = async () => {
            const date = getCurrentDate()
            console.log(date)
            const response = await api.post('/api/photo/new', {date})
            setPhotos(response.data.photos)
            setLoading(false)
        }
        getPhotos()
    }, [])

    return (
        <div className="photo-page-wrapper">
            <p className="photo-page-title">ChatLog <span style={{color: 'rgb(0, 140, 255)'}}>Photographer</span> <Link className="photos-link" to="/photo/create">Опубликовать фотографию</Link> / Новые фотографии <Link className="photos-link" to="/photos/popular">Популярные фотографиии</Link></p>
            <div className="photos">
                {!loading ? photos.map(item => <PhotoCard item={item} />) : <Loader ml={'50%'} /> }
            </div>
        </div>
    )
}

export default New