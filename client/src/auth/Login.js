import React, { useContext, useState, useRef } from 'react'
import "./styles/form.css"
import api from "./api/auth"
import {AuthContext} from '../context/AuthContext'
import Notice from './parts/Notice'
import Loader from '../common_components/Loader'

const Login = () => {
    /*let ref1 = useRef(null)
    let ref2 = useRef(null)
    let ref3 = useRef(null)
    let ref4 = useRef(null)*/
    const [noticeText, setNoticeText] = useState('')
    const [noticeDisplay, setNoticeDisplay] = useState('none')
    const [loading, setLoading] = useState(false)
    const noticeRef = useRef(null)
    //Страница логина
    const auth = useContext(AuthContext)
    //Получение функции навигации
    //Инициализация состояний электронной почты и пароля пользователя
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    //Вход пользователя
    const loginHandler = async () => {
        setLoading(true)
        //Создание объекта для отправки на сервер
        const user = {
            email, password
        }
        //Отправка запроса на вход пользователя
        const response = await api.post('/api/auth/login', user)
        auth.login(response.data.token, response.data.userId)
        setLoading(false)
        //Запись в локальном хранилище браузера ID пользователя
        if(response.data.token && response.data.userId) {
            localStorage.setItem('adblock', false)
            window.location = `/home`
        } else {
            setNoticeText('Введены некорректные данные')
            setNoticeDisplay('block')
        }
        
    }
    // const theme = (theme, ref, num) => {
    //     localStorage.setItem('theme', theme)
    //     ref.current.className = 'theme-button-wb'
    //     ref.current.classList.add('theme-button-bg'+num)
    // }
    return (
        <div>
            <Notice noticeText={noticeText} noticeDisplay={noticeDisplay} noticeRef={noticeRef} />
            <div className="form">
                <h2 className="white-glow-text">Вход</h2>
                {!loading ? <><input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Введите свой email" type="email" className="input" />
                <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" type="password" className="input" />
                {/*localStorage.getItem('adblock') ? <p style={{color: 'yellow', fontSize: '16pt'}}>Если у вас стоит блокировщик рекламы, пожалуйста, отключите его на этом сайте. Он мешает корректной работе соцсети.</p>: <></>*/}
                <button onClick={loginHandler} className="button">Войти</button></> : <><p style={{color: 'white'}}>Подождите, пока данные отправятся на сервер...</p><br /><Loader ml={'50%'} /></>}
            </div>
        </div>
        
    )
}

export default Login