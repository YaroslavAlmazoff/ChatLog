import {useState, useRef} from 'react'
import api from '../auth/api/auth'


const AddBIN = () => {
    const [file, setFile] = useState('')

    const fileRef = useRef()
    //Получение файла изображения поста пользователя
    const emitOpen2 = () => {
        fileRef.current.click()
    }
    
    //Получение файла фотографии пользователя
    const getFile2 = async (e) => {
        let file = e.target.files[0]
        console.log(file)
        //Загрузка файла в состояние
        setFile(file)
    }

    const send = async () => {
        const formData = new FormData()
        formData.append('file', file)
        setFile('')

        await api.post('/api/upload-bin', formData)
    }

    return (
        <div className="form block">
            <span className="color-neon-blue text-glow">Добавление bin</span>
            <input onChange={(e) => getFile2(e)} ref={fileRef} type="file" />
            <button onClick={(e) => emitOpen2(e)} className="button">Добавить</button>
            <button className="button" onClick={send}>Опубликовать</button>
        </div>
    )
}

export default AddBIN