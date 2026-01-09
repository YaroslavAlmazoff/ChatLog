import { useContext, useEffect, useState } from "react"
import ProductItem from '../components/ProductItem'
import { AuthContext } from "../../../context/AuthContext"
import api from '../../../auth/api/auth'
import StoreNav from "../components/StoreNav"

const Basket = () => {
    const auth = useContext(AuthContext)
    const [products, setProducts] = useState([])

    useEffect(() => {
        if(!auth.userId) return
        const getProducts = async () => {
            const response = await api.get('/api/store/basket', {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setProducts(response.data.products)
        }
        getProducts()
    }, [auth])

    return (
        <div className="store-overlay">
            <div className="store">
                <StoreNav />
                <div className="store-products">
                    {products.length ? 
                    products.map(item => <ProductItem item={item} role={'basket'} />)
                : <p style={{color: 'white'}}>Корзина пуста</p>}
                </div>
            </div>
        </div>
    )
}

export default Basket