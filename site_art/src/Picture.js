import { useEffect, useState } from 'react';
import './styles/Picture.css';
import {useParams} from "react-router"
import pictures from './pictures';

const Picture = ({number}) => {
    const params = useParams()
    const [picture, setPicture] = useState({photos: []})
    useEffect(() => {
        setPicture(pictures[params.id])
    }, [params])

    const goToContacts = () => {
        window.location = "/contacts"
      }
      const buy = () => {
        const id = Math.round(Math.random() * 1000000000)
        window.location = `/zakaz/${id}/${params.id}`
      }
    return (
        <div className="page-center bg">
            <p className="picture-title">{picture.title}</p>
            <div className="center">
                {
                    picture.photos.map(photo => <img height="300" style={{marginLeft: "50px", border: "2px solid white", borderRadius: "15px"}} src={require(`./img/additional/${photo}`)} />)
                }
            </div>
                <p className="text-title picture-description">{picture.description}</p>
                
                {picture.decoration ? <span className="text-title" style={{marginTop: "40px"}}> Выполнено в технике: объёмное декорирование; </span> : <></>}
                <span className="text-title"> Используемые материалы: {picture.technic};</span>
                <span className="text-title"> Размер картины: {picture.size} см;</span>
                <span className="text-title"> На обратной стороне картины имеются крепления.</span>
                <span className="text-title" style={{marginTop: "40px"}}>Цена: {picture.price} руб.</span>
                <button className="button" style={{marginTop: "15px", marginBottom: "30px"}} onClick={buy}>Купить</button>
        </div>
    )
    

}

export default Picture