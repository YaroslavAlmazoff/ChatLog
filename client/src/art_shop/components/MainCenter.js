import { useState } from "react"
import PictureItem from "./PictureItem"
import useHighlight from '../../common_hooks/highlight.hook'

const MainCenter = () => {
    const [pictures] = useState([
        {title: 'Осенние цветы рельефная картина', url: require('../img/pictures/0.jpg')},
        {title: 'Осенние цветы рельефная картина', url: require('../img/pictures/0.jpg')},
        {title: 'Осенние цветы рельефная картина', url: require('../img/pictures/0.jpg')},
        {title: 'Осенние цветы рельефная картина', url: require('../img/pictures/0.jpg')},
    ])
    const {randomShadow} = useHighlight()
    const aboutText = 'lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sitlorem ipsum dolor sitlorem ipsum dolor sit'
    const contactsText = 'lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sit lorem ipsum dolor sitlorem ipsum dolor sitlorem ipsum dolor sit'
    return (
        <div id="art" className="main-center">
            <span className={`main-center-title ${randomShadow()}`}>Картины для вашего интерьера</span>
            <span className={`main-center-about ${randomShadow()}`}>{aboutText}</span>
            {
                pictures.map(item => <PictureItem key={Math.random()} item={item}/>)
            }
            <span className={`main-center-contacts ${randomShadow()}`}>{contactsText}</span>
        </div>
    )
}

export default MainCenter