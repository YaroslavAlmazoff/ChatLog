import React, {useState, useEffect, useContext} from "react";
import "../styles/comment.css"
import api from "../api/auth"
import { useParams } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import Loader from "../../common_components/Loader";

const UserFotoComment = ({comment, date, user, id, setFotoComments, fotoComments, foto, setFoto}) => {
    const auth = useContext(AuthContext)
    const [loading, setLoading] = useState(true)
    const params = useParams()
    //Комментарий к посту пользователя
    //Инициализация состояния комментирующего пользователя
    const [commenter, setCommenter] = useState({
        name: 'User',
        surname: 'User',
        avatarUrl: 'user.png'
    })
    const deleteComment = async (id) => {
        let comments = foto.comments
        comments = comments - 1
        setFoto({...foto, comments})
        setFotoComments([...fotoComments].filter(el => {
            console.log(el._id === id)
            return el._id !== id
        }))
        await api.delete(`/api/deletefotocomment/${id}/${params.id}`)
    }
    useEffect(() => {
        //Получение комментирующего пользователя
        const getCommenter = async () => {
            const response = await api.get(`/api/user/${user}`)
            setCommenter(response.data.user)
            setLoading(false)
        }
        getCommenter()
    }, [user])
    return (
        <>{!loading ? <div className="comment-foto">
            {user === auth.userId 
            ? <p className="delete-comment" onClick={() => deleteComment(id)}>&times;</p>
            : <></>}
            <div className="comment-head">
                <div className="user-info">
                    <img className="comment-user-img" src={process.env.REACT_APP_API_URL + '/useravatars/' + commenter.avatarUrl} alt="user"/>
                    <p className="comment-user-name">{commenter.name} {commenter.surname}</p>
                </div>
                <p className="comment-date">{date}</p>
            </div>
            <h4 className="comment-body">{comment}</h4>
        </div> : <><p style={{color: 'white'}}>Подождите, пока данные отправятся на сервер...</p><br /><Loader ml={'50%'} /></>}</>
    )
}

export default UserFotoComment