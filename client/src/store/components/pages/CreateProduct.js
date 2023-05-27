import { useContext, useState, useRef, useEffect } from "react"
import { AuthContext } from "../../../context/AuthContext"
import ImagePreview from "../components/components/ImagePreview"
import api from '../../../auth/api/auth'
import '../../styles/form.css'
import useVerify from "../../../common_hooks/verify.hook"
import FormCategories from "../components/FormCategories"

const CreateProduct = () => {
    const {verify} = useVerify()
    useEffect(() => {
        verify()
    }, [])
    const fileRef = useRef()
    const auth = useContext(AuthContext)

    const [categories, setCategories] = useState([])

    const [name, setName] = useState('')
    const [description, setDesctiption] = useState('')
    const [price, setPrice] = useState(0)
    const [category, setCategory] = useState('')
    const [quantity, setQuantity] = useState(1)
    const [files, setFiles] = useState([])
    const [filesData, setFilesData] = useState([])
    const [imageDisplay, setImageDisplay] = useState('none')

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
        getCategories()
    }, [auth])

    const emitOpen = () => {
        fileRef.current.click()
    }
    const getFile = async (e) => {
        let fileList = e.target.files
        const files = Array.from(fileList)
        files.forEach(el => {
            const reader = new FileReader()
            console.log(el)
            reader.onload = ev => {
                setFilesData(prev => [...prev, ev.target.result])
                setImageDisplay('block')
            }
            reader.readAsDataURL(el)
        })
        setFiles(files)
    }


    const send = async () => {
        const formData = new FormData()

        formData.append('name', name)
        formData.append('description', description)
        formData.append('price', price)
        formData.append('category', category)
        formData.append('quantity', quantity)

        files.forEach((el, index) => {
            formData.append(`file${index}`, el)
        })

        const response = await api.post('/api/store/newproduct', formData, {headers: {
            Authorization: `Bearer ${auth.token}`
        }})
        console.log(response.data.files)
        window.location = '/store/admin'
    }
    const select = (name) => {
        setCategory(name)
    }

    return (
        <div className="product-form">
            <p className="product-form-title">Новый продукт</p>
            <input className="product-form-main-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Название продукта" />
            <textarea className="product-form-area" value={description} onChange={e => setDesctiption(e.target.value)} placeholder="Подробнее..."></textarea>
            <p className="product-form-parameter">Стоимость: <input className="product-form-input" type="text" value={price} onChange={e => setPrice(e.target.value)} />&#8381;</p>
            <span style={{color: 'white'}}>Выберите категорию:</span>
            <FormCategories categories={categories} select={select} />
            <p><span style={{color: 'white'}}>Количество:</span><input className="product-form-main-input" type="number" value={quantity} onChange={e => setQuantity(e.target.value)} /></p>
            <input onChange={e => getFile(e)} type="file" ref={fileRef} multiple />
            <button onClick={e => emitOpen(e)} className="product-form-button">Загрузить изображения</button>
            <div className="product-form-images-list" style={{display: imageDisplay}}>
                {filesData.map(imageUrl => <ImagePreview imageUrl={imageUrl} />)}
            </div>
            <button className="product-form-button" onClick={send}>Создать</button>
        </div>
    )
}

export default CreateProduct