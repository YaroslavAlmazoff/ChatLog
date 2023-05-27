import { useContext, useRef, useState } from "react"
import api from '../../../auth/api/auth'
import useWord from "../../../common_hooks/divideWord.hook"
import { AuthContext } from "../../../context/AuthContext"
import '../styles/create-chat.css'

const CreateChat = () => {
    const {divideWord} = useWord()
    const auth = useContext(AuthContext)
    const fileRef = useRef(null)
    const [title, setTitle] = useState('')
    const [file, setFile] = useState({})
    const [filename, setFilename] = useState('Выберите аватарку')
    const emitOpen = () => {
        fileRef.current.click()
    }
    const getFile = async (e) => {
        let file = e.target.files[0]
        setFilename(divideWord(file.name, 8))
        setFile(file)
    }
    const create = async () => {
        const formData = new FormData()
        formData.append('title', title)
        formData.append('file', file)

        await api.post('/api/createchatroom', formData, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        window.location = '/messages'
    }

    return (
        <div className="create-chat">
            <p className="create-chat-title">Создание беседы</p>
            <input onChange={(e) => getFile(e)} ref={fileRef} type="file"  />
            <button onClick={(e) => emitOpen(e)} className='create-chat-button'>{filename}</button>
            <input className="create-chat-input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Введите название" />
            <button className="create-chat-button" onClick={create}>Создать</button>
        </div>
    )
}

export default CreateChat