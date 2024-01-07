import pictures from "./pictures"
import "./styles/Buy.css"

const ZakazPicture = ({index}) => {

    const picture = pictures[index]

    return (
        <div className="zakaz-picture-parent">
            <div className="zakaz-picture">
                <img src={picture.image} className="zakaz-image" />
            </div>
            <span style={{width: "250%"}}>
                <p className="buy-text2">Картина: ‹‹{picture.title}››</p>
                <p className="buy-text2">{picture.technic}</p>
                <p className="buy-text2">{picture.size}</p>
                <br />
                <br />
                <br />
                <p className="buy-text2">Итого: {picture.price}₽</p>
            </span>
            
        </div>
    )
}

export default ZakazPicture