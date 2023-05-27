import { useEffect, useState } from "react"
import { useParams } from "react-router"
import api from '../../../auth/api/auth'
import FullMemberItem from "./FullMemberItem"

const Members = () => {
    const params = useParams()
    const [members, setMembers] = useState([])

    useEffect(() => {
        const getMembers = async () => {
            const response = await api.get(`/api/fullmembers/${params.id}`)
            setMembers(response.data.members)
        }
        getMembers()
    }, [])

    return (
        <div>
            {
                members.map(el => <FullMemberItem name={el.name} surname={el.surname} avatarUrl={el.avatarUrl} id={el.id} />)
            }
        </div>
    )
}

export default Members