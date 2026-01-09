import Category from "./Category"
import api from '../../../auth/api/auth'
import { useContext, useState } from "react"
import { AuthContext } from "../../../context/AuthContext"
import '../../styles/form.css'
import '../../styles/store.css'

const AdminCategories = ({categories, setCategories}) => {
    const auth = useContext(AuthContext)
    const [name, setName] = useState('')
    const addCategory = async () => {
        await api.post('/api/store/newcategory', {name}, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        setCategories([...categories, {name}])
    }
    const gotoCreate = () => {
        window.location = '/store/create'
    }

    return (
        <>
            <div className="store-add-category">
                <input className="product-admin-input" type="text" placeholder="Название категории" value={name} onChange={e => setName(e.target.value)} />
                <buttton onClick={addCategory} className="product-form-button">+ Категория</buttton>
                <buttton onClick={gotoCreate} className="product-form-button"> + Продукт</buttton>
            </div>
            {
                categories.map(category => <Category category={category} isAdminCategory={true} />)
            }
        </>
    )
}

export default AdminCategories