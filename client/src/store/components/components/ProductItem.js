import '../../styles/product-item.css'
import '../../styles/form.css'
import { useContext, useState } from 'react'
import api from '../../../auth/api/auth'
import { AuthContext } from '../../../context/AuthContext'
import useWord from '../../../common_hooks/divideWord.hook'

const ProductItem = ({item, role}) => {
    const {divideWord} = useWord()
    const auth = useContext(AuthContext)
    const [buttonRemoveText, setButtonRemoveText] = useState('Удалить')
    const [buttonAddToBasketText, setButtonAddToBasketText] = useState('Добавить в корзину')
    const [buttonRemoveFromBasketText, setButtonRemoveFromBasketText] = useState('Удалить из корзины')
    const update = (e) => {
        e.stopPropagation()
        window.location = `/store/update/${item._id}`
    }
    const remove = async (e) => {
        e.stopPropagation()
        setButtonRemoveText('Удалено.')
        await api.delete(`/api/store/removeproduct/${item._id}`, {
            headers:{
                Authorization: `Bearer ${auth.token}`
            }
        })
    }
    const gotoProduct = () => {
        window.location = `/store/product/${item._id}`
    }
    const add = async (e) => {
        e.stopPropagation()
        if(buttonAddToBasketText === 'Добавить в корзину') {
            await api.get(`/api/store/addtobasket/${item._id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            window.location = '/store/basket'
        } else {
            await api.get(`/api/store/removefrombasket/${item._id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setButtonAddToBasketText('Добавить в корзину')
        }
    }
    const removeFromBasket = async (e) => {
        e.stopPropagation()
        if(buttonRemoveFromBasketText === 'Удалить из корзины') {
            await api.delete(`/api/store/removefrombasket/${item._id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setButtonAddToBasketText('Удалено из корзины')
            setButtonRemoveFromBasketText('Удалено из корзины')
        } else {
            await api.get(`/api/store/addtobasket/${item._id}`, {headers: {
                Authorization: `Bearer ${auth.token}`
            }})
            setButtonAddToBasketText('Удалить из корзины')
            setButtonRemoveFromBasketText('Удалить из корзины')
        }
    }
    
    return (
        <div className="product-item" onClick={gotoProduct} style={role == 'basket' ? {width: '30%'}: {width: '40%'}}>
            <img className="product-item-img" src={process.env.REACT_APP_API_URL + '/products/' + item.images[0]} alt="" />
            <div className="product-item-info">
                <span className="product-item-name">{divideWord(item.name, 8)}</span>
                <span className="product-item-price">{item.price}₽</span>
                <div className="product-item-info-right">
                    {/* <span className="product-item-rating">{item.rating}</span> */}
                </div>
            </div>
            {role === 'admin' &&
                <div>
                    <button className="product-form-button" style={{backgroundColor: 'rgb(0, 140, 255)'}} onClick={(e) => update(e)}>Обновить</button>
                    <button className="product-form-button" style={{backgroundColor: 'red'}} onClick={(e) => remove(e)}>{buttonRemoveText}</button>
                </div>
            }
            {role === 'basket' && 
                <div>
                    <button className="product-form-button" style={{backgroundColor: 'red'}} onClick={(e) => removeFromBasket(e)}>{buttonRemoveFromBasketText}</button>
                </div>
            }
            {role === 'product' &&
                <div>
                    <button className="product-form-button" style={{backgroundColor: 'rgb(0, 140, 255)'}} onClick={(e) => add(e)}>{buttonAddToBasketText}</button>
                </div>
            }
        </div>
    )
}

export default ProductItem