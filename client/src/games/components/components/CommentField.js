import { useContext, useState } from "react"
import { useParams } from "react-router"
import api from '../../../auth/api/auth'
import useDate from '../../../common_hooks/date.hook'
import { AuthContext } from "../../../context/AuthContext"
import '../../../videohost/styles/form.css'
import '../../../videohost/styles/comment-field.css'

const CommentField = ({setComments}) => {
    const auth = useContext(AuthContext)
    const params = useParams()
    const {getCurrentDate} = useDate()
    const [comment, setComment] = useState('')

    const send = async () => {
        const response = await api.post(`/api/games/comment/${params.id}`, {comment, date: getCurrentDate()}, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        setComments(response.data.comments)
    }

    return (
        <div className="videohost-comment-field block" style={window.innerWidth < 500 ? {width: '92%'} : {width: '60%'}}>
            <span className="videohost-comment-title blue-text-glow">Напишите отзыв</span>
            <textarea className="videohost-create-area" value={comment} onChange={e => setComment(e.target.value)}></textarea>
            <button className="button" onClick={send}>Отправить</button>
        </div>
    )
}

export default CommentField