import { useContext, useEffect, useState } from "react"
import { useParams } from "react-router"
import { AuthContext } from "../../../context/AuthContext"
import api from '../../../auth/api/auth'
import MemberItem from "./MemberItem"
import useArray from "../../../common_hooks/array.hook"

const AddMembers = ({close}) => {
    const auth = useContext(AuthContext)
    const params = useParams()
    const {unique} = useArray()

    const [friends, setFriends] = useState([])
    const [members, setMembers] = useState([])

    useEffect(() => {
        const getFriends = async () => {
            const response = await api.get('/api/userfriends', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            console.log(response)
            setFriends(response.data.users)
        }
        const getMembers = async () => {
            const response = await api.get(`/api/members/${params.id}`)
            setMembers(response.data.members)
        }
        getFriends()
        getMembers()
    }, [auth])

    const add = (friend) => {
        setMembers([...members, friend])
    }

    const send = async () => {
        const uniqueMembers = unique(members)
        console.log(members, uniqueMembers)
        const response = await api.post(`/api/invite/${params.id}`, {members: uniqueMembers})
        console.log(response)
        close()
    }

    //Отправка участников
    //Обработка запроса на сервере

    return (
        <div className="add-members">
            <button onClick={send} className="messenger-button">Добавить</button>
            <div>
                {
                    friends.map(el => <MemberItem name={el.name} surname={el.surname} avatarUrl={el.avatarUrl} id={el._id} f={add} />)
                }
            </div>
        </div>
    )
}

export default AddMembers