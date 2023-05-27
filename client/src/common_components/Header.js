import React, { useContext, useEffect, useState } from "react"
import './styles/header.css'
import {useRef} from 'react'
import { AuthContext } from "../context/AuthContext"
import api from "../auth/api/auth"

const Header = ({isVerified}) => {
    const [isActivated, setIsActivated] = useState(false)

    
    const auth = useContext(AuthContext)

    useEffect(() => {
        const getIsActivated = async () => {
            const response = await api.get("/api/verify", {headers:{
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
            }})
            setIsActivated(response.data.isActivated)
        }
        getIsActivated()
    }, [])
    //Компонент верхней части приложения
    //Создание ссылок на ссылки:)
    const linkRef1 = useRef('')
    const linkRef2 = useRef('')
    const linkRef3 = useRef('')
    const linkRef4 = useRef('')
    const linkRef5 = useRef('')
    const linkRef6 = useRef('')
    const linkRef7 = useRef('')
    const linkRef8 = useRef('')
    const linkRef9 = useRef('')
    const linkRef10 = useRef('')
    //Добавление классов ссылкам в зависимости от того на какой странице сейчас пользователь
    const visit = (ref, link) => {
        window.location = link
        ref.current.classList.add('link-visited')
        ref.current.click()
    }
    
    return(
        <>
        {isActivated ? <div className="header" id="header">
            <h2 className="logo">CHATLOG.RU</h2>
            <div className="links">
                {auth.isAuthenticated || isVerified 
                ?   <div className="links">
                        <button ref={linkRef1} onClick={() => visit(linkRef1, '/home')} className="link">Главная</button>
                        <button ref={linkRef8} onClick={() => visit(linkRef8, `/user/${auth.userId}`)} className="link">Мой профиль</button>
                        <button ref={linkRef4} onClick={() => visit(linkRef4, '/messages')} className="link">Сообщения</button>
                        <button ref={linkRef7} onClick={() => visit(linkRef7, '/users')} className="link" exact="true">Люди</button>
                        <button ref={linkRef10} onClick={() => visit(linkRef10, '/settings')} className="link" exact="true">Настройки</button>
                    </div>
                : <div>
                    <button ref={linkRef5} onClick={() => visit(linkRef5, '/login')} className="link">Войти</button>
                    <button ref={linkRef6} onClick={() => visit(linkRef6, '/register')} className="link">Регистрация</button>
                </div>}
            </div>
        </div> : <></>}
        </>
    )
}
export default Header