import { useContext, useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import LinkRecipientItem from "./LinkRecipientItem"
import '../../styles/recipients-list.css'
import { AuthContext } from "../../../context/AuthContext"

const LinkRecipientsList = ({file, linkRecipientsDisplay}) => {
    const auth = useContext(AuthContext)
    const [recipients, setRecipients] = useState([])
    useEffect(() => {
        const getRecipients = async () => {
            const response = await api.get('/api/users', {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setRecipients(response.data.users)
        }
        getRecipients()
    }, [auth])
    return (
        <div className="recipients-list" style={{display: linkRecipientsDisplay}}>
            <p style={{color: 'white'}}>Выберите, кому отправить ссылку на файл:</p>
            {recipients.map(item => <LinkRecipientItem item={item} file={file} />)}
        </div>
    )
}

export default LinkRecipientsList