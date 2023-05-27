import { useState } from "react"
import LPV2Service from "./components/LPV2Service"

const LPV2Services = () => {
    const [services] = useState([
        {title: 'Игры', img: require('../../../../img/games.png'), color: 'purple'},
        {title: 'Новости для геймеров', img: require('../../../../img/news.png'), color: 'navy'},
        {title: 'Удобный мессенджер', img: require('../../../../img/messenger.png'), color: 'pink'},
        {title: 'Файловое хранилище', img: require('../../../../img/cloud.png'), color: 'green'},
        {title: 'Реклама игр', img: require('../../../../img/adverts.png'), color: 'orange'},
        //{title: 'Объявления о продаже аккаунтов', img: require('../../../../img/ads.png'), color: 'blue'},
    ])

    return (
        <div className="lpv2-services-wrapper">
            <div className="lpv2-services">
            {
                services.map(el => <LPV2Service el={el} />)
            }
            </div>
        </div>
    )
}

export default LPV2Services