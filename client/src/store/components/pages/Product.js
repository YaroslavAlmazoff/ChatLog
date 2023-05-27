import { useContext, useEffect, useState } from 'react'
import {useParams} from 'react-router'
import api from '../../../auth/api/auth'
import '../../styles/product.css'
import '../../styles/form.css'
import StoreNav from '../components/StoreNav'
import { AuthContext } from '../../../context/AuthContext'

const Product = () => {
    const auth = useContext(AuthContext)
    const params  = useParams()
    const [product, setProduct] = useState({
        images: []
    })
    const [image, setImage] = useState('')

    useEffect(() => {
        const getProduct = async () => {
            const response = await api.get(`/api/store/product/${params.id}`)
            setProduct(response.data.product)
            setImage(process.env.REACT_APP_API_URL + '/products/' + response.data.product.images[0])
        }
        getProduct()
    }, [params])

    const add = async (e) => {
        e.stopPropagation()
        await api.get(`/api/store/addtobasket/${product._id}`, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        window.location = '/store/basket'
    }

    return (
        <div className="product-overlay">
            <div className="product">
                <StoreNav />
                <div className="product-top-side">
                    <div className="product-image-side">
                        <img className="product-image" src={image} alt="" />
                        <div className="product-images">
                            {product.images.length > 1 ? product.images.map(el => <img 
                                style={process.env.REACT_APP_API_URL + '/products/' + el === image ? {border: '1px solid rgb(0, 140, 255)'} : {border: 'none'}} 
                                onClick={() => setImage(process.env.REACT_APP_API_URL + '/products/' + el)} 
                                className="product-small-image" 
                                src={process.env.REACT_APP_API_URL + '/products/' + el} 
                                alt="" 
                            />) : null}
                        </div>
                    </div>
                    <div className="product-info">
                        <span className="product-name">{product.name}</span>
                        <div className="product-numbers">
                            <span className="product-price">{product.price}₽</span>
                            <div className="product-description-side">
                                <span className="product-description">{product.description}</span>
                            </div>
                            <button className="product-form-button" style={{backgroundColor: 'rgb(0, 140, 255)'}} onClick={(e) => add(e)}>Добавить в корзину</button>
                            {/* <span className="product-rating">{product.rating}</span> */}
                        </div>
                    </div>
                </div>
                <div className="product-bottom-side">
                    
                    {/* Отзывы */}
                </div>         
            </div>
        </div>
    )
}

export default Product