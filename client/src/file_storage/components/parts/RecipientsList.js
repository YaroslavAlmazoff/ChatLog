import { useContext, useEffect, useState } from "react"
import api from '../../../auth/api/auth'
import RecipientItem from "./RecipientItem"
import '../../styles/recipients-list.css'
import { AuthContext } from "../../../context/AuthContext"

const RecipientsList = ({file, recipientsDisplay, setRecipientsDisplay}) => {
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
        <div className="recipients-list" style={{display: recipientsDisplay}}>
            <p style={{color: 'white'}}>Выберите, кому отправить файл:</p>
            {recipients.map(item => <RecipientItem item={item} file={file} setRecipientsDisplay={setRecipientsDisplay} />)}
        </div>
    )
}

export default RecipientsList