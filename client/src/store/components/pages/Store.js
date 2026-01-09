import { useEffect, useState } from 'react'
import api from '../../../auth/api/auth'
import Categories from '../components/Categories'
import Products from '../components/Products'
import '../../styles/store.css'
import StoreNav from '../components/StoreNav'

const Store = () => {
    const [selectedCategory, setSelectedCategory] = useState('')
    const [categories, setCategories] = useState([])
    const [products, setProducts] = useState([])

    useEffect(() => {
        const getCategories = async () => {
            const response1 = await api.get('/api/store/categories')
            setCategories(response1.data.categories)
            if(response1.data.categories.length) {
                console.log(response1.data.categories)
                setSelectedCategory(response1.data.categories[0].name)
                const response2 = await api.post('/api/store/productsbycategory', {category: response1.data.categories[0].name})
                setProducts(response2.data.products)
            }
        }
        getCategories()
    }, [])

    const select = (name) => {
        console.log(name)
        setSelectedCategory(name)
    }

    useEffect(() => {
        const getProducts = async () => {
            const response = await api.post('/api/store/productsbycategory', {category: selectedCategory})
            setProducts(response.data.products)
        }
        getProducts()
    }, [selectedCategory])

    return (
        <div className="store-overflow">
            <div className="store">
                <StoreNav />
                <p className="store-title">Добро пожаловать в ChatLog Store</p>
                <div className="store-content">
                    <div className="store-categories">
                        <Categories categories={categories} select={select} />
                    </div>
                    <div className="store-products">
                        <Products products={products} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Store