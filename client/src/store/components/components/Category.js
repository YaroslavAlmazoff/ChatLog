import { useContext, useState } from 'react'
import api from '../../../auth/api/auth'
import { AuthContext } from '../../../context/AuthContext'

const Category = ({category, select, isAdminCategory}) => {
    const auth = useContext(AuthContext)
    const [removeText, setRemoveText] = useState(<>&times;</>)
    const removeCategory = async () => {
        await api.delete(`/api/store/removecategory/${category._id}`, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        setRemoveText(<>Удалено</>)
    }   

    return (
        <div className="store-category" onClick={() => select(category.name)}>
            <span className="store-category-name">{category.name}{isAdminCategory ? <span onClick={removeCategory} className="store-category-delete">{removeText}</span> : null}</span>
        </div>
    )
}

export default Category