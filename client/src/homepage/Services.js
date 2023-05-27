import { useEffect, useState } from "react"
import useVerify from "../common_hooks/verify.hook"
import Service from "./Service"
import './services.css'

const Services = () => {
    const [services, setServices] = useState([])
    const {verify} = useVerify()

    useEffect(() => {
        setServices([
            {title: 'Игры', imageUrl: 'games.png', link: '/games'},
            {title: 'Мессенджер', imageUrl: 'messenger.png', link: '/messages'},
            //{title: 'Ads', imageUrl: 'ads.png', link: '/ad/main'},
            {title: 'Cloud', imageUrl: 'cloud.png', link: '/cloud'},
            //{title: 'Advertisements', imageUrl: 'innerad.png', link: '/innerad/cabinet'},
            {title: 'Видеоблогер', imageUrl: 'videoblogger.png', link: '/videohost'},
            //{title: 'Магазин', imageUrl: 'videoblogger.png', link: '/store'},
        ])
        verify()
    }, [])

    return (
        <div className="services">
            <div className="services-list">
                {services.map(item => <Service item={item} />)}
            </div>
        </div>
    )
}

export default Services