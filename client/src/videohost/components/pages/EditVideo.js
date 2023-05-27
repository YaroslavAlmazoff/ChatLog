import {useState, useRef, useEffect, useContext} from 'react'
import useDate from '../../../common_hooks/date.hook'
import api from '../../../auth/api/auth'
import ImagePreview from '../components/ImagePreview'
import { useParams } from 'react-router'
import '../../styles/form.css'
import { AuthContext } from '../../../context/AuthContext'
import Loader from '../../../common_components/Loader'
import useVerify from '../../../common_hooks/verify.hook'

const CreateVideo = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const [loading, setLoading] = useState(false)
    const auth = useContext(AuthContext)
    const params = useParams()
    const fileRef1 = useRef('')
    const {getCurrentDate} = useDate()
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [channel, setChannel] = useState('')
    const [file1, setFile1] = useState('')

    const [error, setError] = useState('')

    const [previewOpened, setPreviewOpened] = useState(false)
    const [previewUrl, setPreviewUrl] = useState('')

    const [imageDisplay1, setImageDisplay1] = useState('none')
    const [imageUrl1, setImageUrl1] = useState('')

    useEffect(() => {
        setLoading(true)
        const getChannel = async () => {
            const response = await api.get(`/api/videohost/videos/video/${params.id}`)
            const {title, description} = response.data.video
            setChannel(response.data.video.channel)
            setTitle(title) 
            setDescription(description)
            setPreviewUrl(response.data.video.previewUrl)
            setLoading(false)
        }
        getChannel()
    }, [params])

    const emitOpen1 = () => {
        fileRef1.current.click()
    }
    const getFile1 = async (e) => {
        let file = e.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.onload = ev => {
            setImageDisplay1('block')
            setImageUrl1(ev.target.result)
        }
        reader.readAsDataURL(file)
        setFile1(file)
        setPreviewOpened(true)
    }
    const send = async () => {
        if(!title || !file1) {
            setError('Не заполнены основные параметры видео')
            return
        }
        setLoading(true)
        const formData = new FormData()
        formData.append('title', title)
        formData.append('description', description)
        formData.append('date', getCurrentDate())
        formData.append('preview', file1)
        formData.append('id', params.id)

        await api.post('/api/videohost/videos/edit', formData, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        setLoading(false)
        window.location = `/videohost/channel/${channel}`
    }

    return (
        <>{!loading ? <div className='videohost-create'>
            <p className='videohost-create-title'>Редактирование видео</p>
            <input value={title} onChange={e => setTitle(e.target.value)} className='videohost-create-input' type='text' placeholder='Введите название видео' />
            <textarea value={description} onChange={e => setDescription(e.target.value)} className='videohost-create-area' placeholder='Описание к видео'></textarea>
            <input onChange={e => getFile1(e)} type="file" ref={fileRef1} />
            <button onClick={e => emitOpen1(e)} className="videohost-create-empty-button">Загрузить превью</button>
            {previewOpened ? <ImagePreview imageDisplay={imageDisplay1} imageUrl={imageUrl1} /> : <>{previewUrl ? <img width="200" src={process.env.REACT_APP_API_URL + '/videopreviews/' + previewUrl} /> : null}</>}
            {error ? <p style={{color: 'red'}}>{error}</p> : null}
            <button onClick={send} className='videohost-main-button'>Обновить видео</button>
        </div> : <><p style={{color: 'white'}}>Подождите пока данные отправятся на сервер</p><br /><Loader ml={'50%'} /></>}
        </>
    )
}

export default CreateVideo