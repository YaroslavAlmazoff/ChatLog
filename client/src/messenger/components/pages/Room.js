import React, { useContext, useEffect, useState, useRef } from "react"
import "../styles/room.css"
import api from '../../../auth/api/auth'
import {useParams} from 'react-router-dom'
import { AuthContext } from "../../../context/AuthContext"
import useDate from "../../../common_hooks/date.hook"
import ImagePreview1 from "../../../auth/parts/ImagePreview1"
import VideoPreview from "../../../auth/parts/VideoPreview"
import Message from "../parts/Message"
import {smiles} from './smiles'
import Smile from "../parts/Smile"
import '../styles/smiles.css'
import '../styles/actions.css'
import Loader from "../../../common_components/Loader"
import useVerify from "../../../common_hooks/verify.hook"
import useHighlight from "../../../common_hooks/highlight.hook"

export const Room = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [verify])
    const {randomColor, randomShadow, randomBlockShadow} = useHighlight()
    const messageRef = useRef(null)
    const {getCurrentDate} = useDate()
    const auth = useContext(AuthContext)
    const [messages, setMessages] = useState([])
    const [penFriend, setPenFriend] = useState('')
    const [fullPenFriend, setFullPenFriend] = useState({})
    const [smilesDisplay, setSmilesDisplay] = useState('none')
    const [messageActions, setMessageActions] = useState(false)
    const [currentMessage, setCurrentMessage] = useState({})
    const [loading, setLoading] = useState(true)
    const params = useParams()
    const roomRef = useRef()
    const fileRef = useRef()
    const fileRefVideo = useRef()

    const [imagePreviewDisplay1, setImagePreviewDisplay1] = useState('none')
    const [imagePreviewUrl1, setImagePreviewUrl1] = useState('')
    const [videoPreviewUrl, setVideoPreviewUrl] = useState('')
    const [videoPreviewDisplay, setVideoPreviewDisplay] = useState('none')
    const [file, setFile] = useState('')
    const [videoFile, setVideoFile] = useState('')

    //Эмитирование открытия загрузки файла изображения для поста
    const emitOpen = () => {
        fileRef.current.click()
    }
    //Получение файла изображения поста пользователя
    const getFile = async (e) => {
        let file = e.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.onload = ev => {    
            if(file.type === 'image/jpeg' || file.type === 'image/png') {
                setImagePreviewDisplay1('block')  
                setImagePreviewUrl1(ev.target.result)
            } else {
                setVideoPreviewDisplay('block')  
                setVideoPreviewUrl(ev.target.result)
            }
            
        }
        reader.readAsDataURL(file)
        //Загрузка файла в состояние
        setFile(file)
    }
    //Эмитирование открытия загрузки файла изображения для поста
    const emitOpenVideo = () => {
        fileRefVideo.current.click()
    }
    //Получение файла изображения поста пользователя
    const getFileVideo = async (e) => {
        let file = e.target.files[0]
        console.log(file)
        const reader = new FileReader()
        reader.onload = ev => {    
            if(file.type === 'image/jpeg' || file.type === 'image/png') {
                setImagePreviewDisplay1('block')  
                setImagePreviewUrl1(ev.target.result)
            } else {
                setVideoPreviewDisplay('block')  
                setVideoPreviewUrl(ev.target.result)
            }
            
        }
        reader.readAsDataURL(file)
        //Загрузка файла в состояние
        setVideoFile(file)
    }
    useEffect(() => {
        if(localStorage.getItem('file-link')) {
            console.log(localStorage.getItem('file-link'))
            messageRef.current.value = localStorage.getItem('file-link')
        }
        
    }, [])
    const subscribe = async () => {
        
        roomRef.current.scrollTop = roomRef.current.scrollHeight;
        try {
            const response = await api.get(`/api/getmessages/${params.id}`)
            console.log(response)
            
            setMessages(response.data.messages)
            
            await subscribe()
        } catch(e) {
            setTimeout(() => {
                subscribe()
            }, 500)
        }
    }
    
    useEffect(() => {
        const dialog = async () => {
            const response = await api.get(`/api/roombyid/${params.id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            console.log(response)
            const user1 = response.data.room.user1
            const user2 = response.data.room.user2
            
            let user = ''
            if(user1 === auth.userId) {
                user = user2
            } else {
                user = user1
            }
            const userResponse = await api.get(`/api/user/${user}`)
            setFullPenFriend(userResponse.data.user)
            console.log(response.data.user)
            const name = userResponse.data.user.name
            const surname = userResponse.data.user.surname
            const fullName = name + ' ' + surname
            console.log(fullName)
            setPenFriend(fullName)
        }
        const subscribeStart = async () => {
            try {
                const response = await api.get(`/api/getmessagesstart/${params.id}`)
                console.log(response)
                setMessages(response.data.messages)
                setLoading(false)
                const newMessages = response.data.messages
                const lastMessageUser = newMessages[newMessages.length - 1].user
                console.log(response.data.messages, newMessages, lastMessageUser)
                await subscribe()
            } catch(e) {
                setTimeout(async () => {
                    await subscribe()
                }, 500)
            }
        }
        subscribeStart()
        dialog()
        
        
        
    }, [params, auth, subscribe])

    useEffect(() => {
        const readMessage = async () => {
            const res = await api.get(`/api/read/${messages[messages.length - 1]._id}`)
            console.log(res)
        }
        if(!messages.length) {
            return
        }
        console.log(messages, auth.userId !== messages[messages.length - 1].user)
        if(auth.userId !== messages[messages.length - 1].user) {
            readMessage()
        }
    }, [auth, messages])
    
    
    const sendMessage = async () => {
        if(!currentMessage._id) {
            console.log('aaaaaaaaaaaaaaaaa')
            setVideoFile('')
            setFile('')
            console.log('КАК ЖЕ ЗАДОЛБАЛА МЕНЯ ЭТА ХРЕНЬ')
            //const res = await api.get(`/api/read/${params.id}`)
            console.log('хрень')
            const date = getCurrentDate()
            let formData = new FormData()
            console.log(file)
            formData.append('message', messageRef.current.value)
            formData.append('date', date)
            formData.append('file', file)
            formData.append('videofile', videoFile)
            formData.append('isFile', !!localStorage.getItem('file-link'))
            
            await api.post(`/api/lastmessage/${params.id}`, {lastMessage: messageRef.current.value})

            await api.post(`/api/sendmessage/${params.id}`,
                formData, {headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${auth.token}`,   
            }})
            messageRef.current.value = ''
            if(videoFile) {
                window.location.reload()
            }
        } else {
            await api.post(`/api/editmessage/${currentMessage._id}`, {message: messageRef.current.value})
            messageRef.current.value = ''
            setMessageActions(false)
            setCurrentMessage({})
            window.location.reload()
        }   
    }
    const addSmile = (code) => {
        setSmilesDisplay('none')
        messageRef.current.value = messageRef.current.value + code
    }
    const showSmiles = () => {
        if(smilesDisplay === 'none') {
            setSmilesDisplay('block')
            setTimeout(() => {
                setSmilesDisplay('none')
            }, 10000)
        } else {
            setSmilesDisplay('none')
        }
        console.log('sesh')
    }

    const deleteMessage = async () => {
        await api.delete(`/api/deletemessage/${currentMessage._id}`)
        setMessages([...messages].filter(el => el._id !== currentMessage._id))
        setMessageActions(false)
        setCurrentMessage({})
    }
    const editMessage = async () => {
        messageRef.current.value = currentMessage.message
    }

    const showMessageActions = (mess) => {
        if(!messageActions) {
            setMessageActions(true)
            setCurrentMessage(mess)
            setTimeout(() => {
                setMessageActions(false)
            }, 10000)
        } else {
            setMessageActions(false)
            setCurrentMessage({})
        }
        console.log('sesh')
    } 

    return (
            <div className="room-wrapper">
            <div ref={roomRef} className="room-window block">
                <div className={`room-head ${randomColor()} ${randomShadow()}`}><span className={`${randomColor()} ${randomShadow()}`}>{penFriend} | В сети {fullPenFriend.lastVisit}</span></div>
                    {messageActions && <div className="room-message-actions">
                        <span onClick={editMessage} className="room-message-action" style={{color: 'rgb(0, 140, 255)'}}>Редактировать</span>
                        <span onClick={deleteMessage} className="room-message-action" style={{color: 'red'}}>Удалить</span>
                    </div>}
                    <div className="room-smiles" style={{display: smilesDisplay}}>
                        {smiles.map(el => <Smile key={el.code} el={el} addSmile={addSmile} />)}
                    </div>
                    <div className="messages">
                    
                    {!loading ? 
                        messages.map(mess => <Message mess={mess} showMessageActions={showMessageActions} />)
                        : <Loader ml={'50%'} />
                    }
                        </div>
                </div>
            <div className="message-actions">
                <input ref={messageRef} type="text" className="message-input input" placeholder="Напишите сообщение..." />
                <img onClick={showSmiles} className="upload-message-image" src={require(`../../img/smile.png`)} alt='img'/>
                <img onClick={(e) => emitOpen(e)} className="upload-message-image" src={require(`../../img/upload-image.png`)} alt='img'/>
                <img onClick={(e) => emitOpenVideo(e)} className="upload-message-image" src={require(`../../img/upload-video.png`)} alt='img'/>
                <button onClick={sendMessage} className="send-message">Отправить</button>
                <input onChange={(e) => getFile(e)} ref={fileRef} type="file" />
                <input onChange={(e) => getFileVideo(e)} ref={fileRefVideo} type="file" />
            </div>
            {file.type === 'image/jpeg' || file.type === 'image/png'
                ? <ImagePreview1 imagePreviewUrl1={imagePreviewUrl1} imagePreviewDisplay1={imagePreviewDisplay1} />
                : <VideoPreview videoPreviewDisplay={videoPreviewDisplay} videoPreviewUrl={videoPreviewUrl} />
            }
        </div>
        
        
    )
}