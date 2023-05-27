import {NavLink} from "react-router-dom"
import {useContext} from "react"
import {AuthContext} from "../../context/AuthContext"

const Links = () => {
    const auth = useContext(AuthContext)
    const list1 = [
        {name: 'Моя страница', link: `/user/${auth.userId}`},
        {name: 'Сообщения', link: '/messages'},
        {name: 'Игры', link: '/games'},
        {name: 'Люди', link: '/users'},
        {name: 'Группы', link: `/publics`},
    ]
    const list2 = [
        {name: 'Chat Log Видеоблогер', link: `/videohost`},
        {name: 'Chat Log Cloud', link: `/cloud`},
        /*{name: 'Chat Log Реклама', link: `/innerad/cabinet`},*/
        //{name: 'Chat Log Ads', link: `/ad/main`},
        //{name: 'Chat Log Store', link: `/store`},
    ]
    const list3 = [
        {name: 'Моя страница', link: `/user/${auth.userId}`},
        {name: 'Сообщения', link: '/messages'},
        {name: 'Игры', link: '/games'},
        {name: 'Люди', link: '/users'},
        {name: 'Группы', link: `/publics`},
        {name: 'Сервисы', link: '/services'},
    ]

    return (
        <div className="homelinks">
            {
                window.innerWidth > 500 
                ?
                <>{list1.map(el => <NavLink key={Date.now() + Math.random() * 100} className="homelink" to={el.link}>{el.name}</NavLink>)}
                {list2.map(el => <NavLink key={Date.now() + Math.random() * 100} className="homelink" to={el.link}>{el.name}</NavLink>)}
                </>
                :
                <>{list3.map(el => <NavLink key={Date.now() + Math.random() * 100} className="homelink" to={el.link}>{el.name}</NavLink>)}
                </>
            }
        </div>
    )
}

export default Links