import { useEffect, useState } from "react"
import NavigationLink from "./components/NavigationLink"

const Navigation = () => {
    const [links, setLinks] = useState([])

    useEffect(() => {
        setLinks([
            {name: 'Главная', url: '/videohost'},
            {name: 'Рекомендованные видео', url: '/videohost/recommended/videos'},
            {name: 'Рекомендованные каналы', url: '/videohost/recommended/channels'},
            {name: 'Новое', url: '/videohost/new'},
            {name: 'Популярное', url: '/videohost/popular'},
            {name: 'Интересное', url: '/videohost/interesting'},
            {name: 'Подписки', url: '/videohost/subscribes', last: true},
            
        ])
    }, [])

    return (
        <div style={{width: '100%'}}>
            <div className="videohost-navigation">
            {
                links.map(item => <NavigationLink item={item} />)
            }
            </div>
        </div>
    )
}

export default Navigation