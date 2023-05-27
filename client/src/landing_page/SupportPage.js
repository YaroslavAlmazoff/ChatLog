import { useState } from "react"
import api from '../auth/api/auth'
import './support-page.css'

const SupportPage = () => {
    const [message, setMessage] = useState('Ваше сообщение...')
    const sendMessage = async () => {
        const response = await api.post('/api/admin/sendmessage', {message})
        console.log(response)
        window.location = `/greeting`
    }
    return (
        <div className='support_page green-block-glow'>
            <span className="color-neon-orange blue-text-glow support_page_text">Подробно опишите проблему:</span>
            <textarea className="support_page_area blue-block-glow area" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
            <button onClick={sendMessage} className="button support_page_button">Отправить</button>
        </div>
    )
}

export default SupportPage