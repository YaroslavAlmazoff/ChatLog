import { useContext, useState } from "react"
import useDate from "../../../common_hooks/date.hook"
import { AuthContext } from "../../../context/AuthContext"
import api from '../../../auth/api/auth'
import '../../styles/comment-field.css'
import '../../styles/form.css'
import { useParams } from "react-router"

const CommentField = ({comments, setComments}) => {
    const params = useParams()
    const auth = useContext(AuthContext)
    const {getCurrentDate} = useDate()
    const [text, setText] = useState('')

    const send = async () => {
        const date = getCurrentDate()
        await api.post(`/api/videohost/useractions/comment/${params.id}`, {
            date, text
        }, {
            headers: {
                Authorization: `Bearer ${auth.token}`
            }
        })
        window.location.reload()
    }

    return (
        <div className="videohost-comment-field">
            <p className="videohost-comment-title">Комментарий</p>
            <textarea value={text} onChange={e => setText(e.target.value)} className="videohost-create-area" placeholder="Комментарий"></textarea>
            <button onClick={send} className="videohost-create-empty-button">Отправить</button>
        </div>
    )
}

export default CommentField