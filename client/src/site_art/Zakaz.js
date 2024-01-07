import { useParams } from "react-router"
import ZakazDelivery from "./ZakazDelivery"
import ZakazForm from "./ZakazForm"
import ZakazPicture from "./ZakazPicture"
import "./styles/Zakaz.css"
import "./styles/Buy.css"
import pictures from "./pictures"



const Zakaz = () => {
    const params = useParams()
    const picture = pictures[params.i]

    return (
        <div className="zakaz" style={{color: "white", textDecoration: 'underline'}}>
            <p className="zakaz-text">Оформление заказа</p>
            <ZakazPicture index={params.i} />
            <div className="zakaz-bottom">
                <ZakazDelivery picture={picture.title} price={picture.price} />
            </div>
        </div>
    )
}

export default Zakaz