import { useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import PhotoCard from "../components/PhotoCard"
import '../../styles/photo-list.css'
import Title from "../components/Title"
import Loader from "../../../common_components/Loader"
import useVerify from "../../../common_hooks/verify.hook"

const Popular = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const [photos, setPhotos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getPhotos = async () => {
            const response = await api.get('/api/photo/popular')
            setPhotos(response.data.photos)
            setLoading(false)
        }
        getPhotos()
    }, [])

    return (
        <div className="photo-page-wrapper">
            <Title />
            <div className="photos">
                {!loading ? photos.map(item => <PhotoCard item={item} />) : <Loader ml={'50%'} />}
            </div>
        </div>
    )
}

export default Popular