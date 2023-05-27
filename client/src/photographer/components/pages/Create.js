import { useState, useRef, useContext } from "react"
import api from '../../../auth/api/auth'
import { AuthContext } from "../../../context/AuthContext"
import PhotoPreview from "../components/PhotoPreview"
import useDate from '../../../common_hooks/date.hook'
import '../../styles/create.css'
import Loader from "../../../common_components/Loader"

const Create = () => {
    const {getCurrentDate} = useDate()
    const auth = useContext(AuthContext)
    const fileRef = useRef()

    const [title, setTitle] = useState('')
    const [file, setFile] = useState('')

    const [description, setDescription] = useState('')
    const [place, setPlace] = useState('')
    const [time, setTime] = useState('')
    const [params, setParams] = useState('')

    const [imageDisplay, setImageDisplay] = useState('none')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)

    const emitOpen = () => {
        fileRef.current.click()
    }
    const getFile = async (e) => {
        let file = e.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.onload = ev => {
            setImageDisplay('block')
            setImageUrl(ev.target.result)
        }
        reader.readAsDataURL(file)
        setFile(file)
    }

    const send = async () => {
        if(!file) return
        setLoading(true)
        const date = getCurrentDate()
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('place', place)
        formData.append('time', time)
        formData.append('params', params)
        formData.append('photo', file)
        formData.append('date', date)

        await api.post(`/api/photo/create/${auth.userId}`, formData, {headers: 
            {'Content-Type': 'multipart/form-data'}
        })
        setLoading(false)
        window.location = '/photos/new'
    }

    return (
        <div className="photo-create-page">
            <p className="photo-page-title">ChatLog <span style={{color: 'rgb(0, 140, 255)'}}>Photographer</span> / Загрузить фотографию</p>
            {!loading ? <div className="photo-create-form">
                <input className="photo-important-input" type="text" placeholder="Название фотографии" value={title} onChange={e => setTitle(e.target.value)} />
                <textarea className="photo-area" placeholder="Описание фотографии" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                <input onChange={(e) => getFile(e)} ref={fileRef} type="file"  />
                <button onClick={(e) => emitOpen(e)} className="photo-button">Загрузить фотографию</button>
                <div style={{marginTop: '10px', marginBottom: '10px'}}>
                    <PhotoPreview imageDisplay={imageDisplay} imageUrl={imageUrl} />
                </div>
                <div className="photo-not-important">
                    <p className="photo-not-important-title">Необязательные параметры</p>
                    <input className="photo-input" type="text" placeholder="Место съёмки" value={place} onChange={e => setPlace(e.target.value)} />
                    <input className="photo-input" type="text" placeholder="Дата и время съёмки" value={time} onChange={e => setTime(e.target.value)} />
                    <input className="photo-input" type="text" placeholder="Параметры съёмки" value={params} onChange={e => setParams(e.target.value)} />
                </div>
                <button onClick={send} className="photo-main-button">Опубликовать</button>
            </div> : <><p style={{color: 'white'}}>Подождите, пока данные отправятся на сервер...</p><br /><Loader ml={'50%'} /></>}
        </div>
    )
}

export default Create