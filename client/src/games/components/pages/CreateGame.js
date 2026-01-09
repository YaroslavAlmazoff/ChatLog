import { useState, useRef } from 'react'
import '../../styles/form.css'
import ImagePreview from '../components/ImagePreview'
import api from '../../../auth/api/auth'

const CreateGame = () => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [version, setVersion] = useState('1.0')
    const [imagePreviewDisplay, setImagePreviewDisplay] = useState('none')
    const [imagePreviewUrl, setImagePreviewUrl] = useState('')
    const [preview, setPreview] = useState('')
    const [source, setSource] = useState('')

    const [buttonText, setButtonText] = useState('Добавить APK файл')

    const fileRef = useRef()
    const fileRef2 = useRef()

    const getPreview = async (e) => {
        let file = e.target.files[0]
        const reader = new FileReader()
        reader.onload = ev => {
            setImagePreviewDisplay('block')
            setImagePreviewUrl(ev.target.result)
        }
        reader.readAsDataURL(file)
        setPreview(file)
    }
    const getSource = async (e) => {
        let file = e.target.files[0]
        setSource(file)
        setButtonText(file.name)
    }

    const emitOpen1 = () => {
        fileRef.current.click()
    }
    const emitOpen2 = () => {
        fileRef2.current.click()
    }



    const send = async () => {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('description', description)
        formData.append('preview', preview)
        formData.append('source', source)
        formData.append('version', version)
        await api.post(`/api/games/upload`, formData, {headers: 
            {'Content-Type': 'multipart/form-data'}
        })
        window.location = `/games`
    }

    return (
        <div className="create-game">
            <p className="create-game-title">Новая игра</p>
            <input className="create-game-input" value={name} onChange={e => setName(e.target.value)} placeholder="Название игры" />
            <textarea className="create-game-input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Краткое описание" ></textarea>
            <input onChange={(e) => getPreview(e)} ref={fileRef} type="file" />
            <input onChange={(e) => getSource(e)} ref={fileRef2} type="file" accept='.apk' />
            <button onClick={(e) => emitOpen1(e)} className='create-game-empty-button'>Выберите иконку игры</button>
            <ImagePreview imageDisplay={imagePreviewDisplay} imageUrl={imagePreviewUrl} />
            <button onClick={(e) => emitOpen2(e)} className='create-game-empty-button'>{buttonText}</button>
            <input className="create-game-input" value={version} onChange={e => setVersion(e.target.value)} placeholder="Версия" />
            <button onClick={send} className="create-game-button">Опубликовать</button>
        </div>
    )
}

export default CreateGame