import { useContext, useEffect, useState } from "react"
import {AuthContext} from '../../../context/AuthContext'
import api from '../../../auth/api/auth'
import '../../styles/admin.css'
import '../../styles/store.css'
import AdminCategories from "../components/AdminCategories"
import AdminProducts from "../components/AdminProducts"
import StoreNav from "../components/StoreNav"

const AdminPanel = () => {
    const auth = useContext(AuthContext)
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        if(!auth.userId) return
        const isAdmin = async () => {
            const response = await api.get('/api/store/isadmin', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            if(!response.data.isAdmin) {
                window.location = '/home'
            }
        }
        isAdmin()
        const getCategories = async () => {
            const response = await api.get('/api/store/admincategories', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            setCategories(response.data.categories)
        }
        const getProducts = async () => {
            const response = await api.get('/api/store/adminproducts', {
                headers: {
                    Authorization: `Bearer ${auth.token}`
                }
            })
            setProducts(response.data.products)
        }
        getCategories()
        getProducts()
    }, [auth])

    return (
        <div className="store-overlay">
            <div className="store">
                <StoreNav />
                <div className="store-content">
                    <div className="store-categories">
                        <AdminCategories categories={categories} setCategories={setCategories} />
                    </div>
                    <div className="store-products">
                        <AdminProducts products={products} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminPanel