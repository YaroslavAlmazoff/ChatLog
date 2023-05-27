import api from "../api/auth"
import {AuthContext} from '../../context/AuthContext'
import { useContext } from "react"
import useDate from '../../common_hooks/date.hook'

const usePosts = () => {
    const auth = useContext(AuthContext)
    const {getCurrentDate} = useDate()
        
    const sendFoto = async (file2, userFotos, setUserFotos) => {
        if(file2) {
            const currentDate = getCurrentDate()
            let formData2 = new FormData()
            formData2.append('file', file2)
            formData2.append('date', currentDate)
            formData2.append('likes', 0)
            formData2.append('comments', 0)
            const response = await api.post(`/api/createuserfoto`, formData2, {headers: 
                {'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${auth.token}`
            }
            })
            setUserFotos([...userFotos, {imageUrl: response.data.filename}])
            window.location.reload()
        } else {
            console.log('не выбрана фотография')
        }
    }
    const deleteFoto = async (url) => {
        await api.delete(`/api/deleteuserfoto/${url}`)
        window.location = `/user/${auth.userId}`
    }
    
    const deleteVideo = async (e, id, setUserVideos, userVideos) => {
        e.stopPropagation()
        console.log(id, userVideos)
        setUserVideos([...userVideos].filter(el => el._id !== id))
        await api.delete(`/api/video/${id}`)
    }
    return {sendFoto, deleteFoto, deleteVideo}
}

export default usePosts


