import {useState, useContext, useRef, useEffect} from 'react'
import useDate from '../../../common_hooks/date.hook'
import api from '../../../auth/api/auth'
import {AuthContext} from '../../../context/AuthContext'
import ImagePreview from '../components/ImagePreview'
import Categories from '../components/Categories'
import '../../styles/form.css'
import Loader from '../../../common_components/Loader'
import useVerify from '../../../common_hooks/verify.hook'

const CreateChannel = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const fileRef1 = useRef('')
    const fileRef2 = useRef('')
    const {getCurrentDate} = useDate()
    const auth = useContext(AuthContext)
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [file1, setFile1] = useState('')
    const [file2, setFile2] = useState('')
    const [categoriesDisplay, setCategoriesDisplay] = useState('none')

    const [imageDisplay1, setImageDisplay1] = useState('none')
    const [imageUrl1, setImageUrl1] = useState('')
    const [imageDisplay2, setImageDisplay2] = useState('none')
    const [imageUrl2, setImageUrl2] = useState('')

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
    }
    const emitOpen2 = () => {
        fileRef2.current.click()
    }
    const getFile2 = async (e) => {
        let file = e.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.onload = ev => {
            setImageDisplay2('block')
            setImageUrl2(ev.target.result)
        }
        reader.readAsDataURL(file)
        setFile2(file)
    }

    const select = (el) => {
        setCategory(el)
    }
    const showCategories = () => {
        if(categoriesDisplay === 'none') {
            setCategoriesDisplay('flex')
        } else {
            setCategoriesDisplay('none')
        }
    }
    const send = async () => {
        if(!name) {
            setError('Не заполнены главные поля создания канала')
            return
        }
        setLoading(true)
        if(!name) return
        const date = getCurrentDate()
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('category', category)
        formData.append('date', date)
        formData.append('avatar', file1)
        formData.append('banner', file2)

        const response = await api.post('/api/videohost/channels/create', formData, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        if(!response.data.error) {
            const data = await api.post('/api/videohost/channels/channelbyname',{name})
            setLoading(false)
            window.location = `/videohost/channel/${data.data.channel._id}`
        } else {
            setError(response.data.error)
            setLoading(false)
        }
        
    }

    return (
        <>{!loading ? 
        <div className='videohost-create'>
            <p className='videohost-create-title'>Создание канала</p>
            <input value={name} onChange={e => setName(e.target.value)} className='videohost-create-input' type='text' placeholder='Введите название канала' />
            <button onClick={showCategories} className='videohost-create-empty-button'>Выбрать категорию</button>
            <Categories display={categoriesDisplay} select={select} />
            {category && <p style={{color: 'white'}}>Категория: {category}</p>}
            <textarea value={description} onChange={e => setDescription(e.target.value)} className='videohost-create-area' placeholder='Подробное описание, что будет публиковаться'></textarea>
            <input onChange={e => getFile1(e)} type="file" ref={fileRef1} />
            <button onClick={e => emitOpen1(e)} className="videohost-create-empty-button">Загрузить аватар канала</button>
            <ImagePreview imageDisplay={imageDisplay1} imageUrl={imageUrl1} />
            <input onChange={e => getFile2(e)} type="file" ref={fileRef2} />
            <button onClick={e => emitOpen2(e)} className="videohost-create-empty-button">Загрузить шапку канала</button>
            <ImagePreview imageDisplay={imageDisplay2} imageUrl={imageUrl2} />
            <button onClick={send} className='videohost-main-button'>Создать канал</button>
            <p style={{color: 'red'}}>{error}</p>
            </div> : <><p style={{color: 'white'}}>Подождите пока данные отправятся на сервер...</p><br /><Loader ml={'50%'} /></>}
        </>
    )
}

export default CreateChannel