import React, { useState, useContext, useRef, useEffect } from 'react'
import "./styles/form.css"
import api from "./api/auth"
import {AuthContext} from '../context/AuthContext'
import Loader from '../common_components/Loader'

const Register = () => {
    // useEffect(() => {
    //     localStorage.setItem('adblock', true)
    // }, [])
    // let ref1 = useRef(null)
    // let ref2 = useRef(null)
    // let ref3 = useRef(null)
    // let ref4 = useRef(null)

    const regRef = useRef(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    //Страница регистрации пользователя
    const auth = useContext(AuthContext)
    //Получение функции навигации

    //Инициализация состояний информации о пользователе
    const [name, setName] = useState('')
    const [surname, setSurName] = useState('')
    const [age, setAge] = useState('')
    const [email, setEmail] = useState('')
    const [country, setCountry] = useState('')
    const [city, setCity] = useState('')
    const [password, setPassword] = useState('')
    const [password2, setPassword2] = useState('')
    //Регистрация пользователя
    const registerHandler = async () => {
        if(!name) {
            setError('Введите имя')
            return
        }
        if(!surname) {
            setError('Введите фамилию')
            return
        }
        if(!email) {
            setError('Введите почту')
            return
        }
        if(!password || !password2) {
            setError('Где-то не введен пароль')
            return
        }
        if(password !== password2) {
            setError('Пароли не совпадают')
            return
        }
        regRef.current.disabled = true
        setLoading(true)
        //Создание объекта для отправки на сервер
        const user = {
            name, surname, age, email, country, city, password
        }
        //Отправка запроса на регистрацию пользователя
        const response = await api.post('/api/auth/register', user)
        if(response.data.error) {
            setError(response.data.error)
            return
        }
        auth.login(response.data.token, response.data.userId)
        setLoading(false)
        //Запись в локальное хранилище браузера ID пользователя
         //Перемещение на профиль пользователя
        localStorage.setItem('registered', true)
        window.location = `/notactivated`
    }
    // const theme = (theme, ref, num) => {
    //     localStorage.setItem('theme', theme)
    //     ref.current.className = 'theme-button-wb'
    //     ref.current.classList.add('theme-button-bg'+num)
    // }
    return (
        <div className="form">
            <h2 className="white-glow-text">Регистрация</h2>
            {!loading ? <><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Введите имя" type="text" className="input" />
            <input value={surname} onChange={(e) => setSurName(e.target.value)} placeholder="Введите фамилию" type="text" className="input" />
            <p className='white-glow-text'>Введите дату рождения</p>
            <input value={age} onChange={(e) => setAge(e.target.value)} placeholder="Выберите возраст" type="date" className="input" />
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Введите свой email" type="email" className="input" />
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Введите свою страну (необязательно)" type="text" className="input" />
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Введите свой город (необязательно)" type="text" className="input" />
            {/* <p className="theme-title">Выберите тему для домашней страницы</p>
            <button ref={ref1} onClick={() => theme('city', ref1, 1)} className='theme-button theme-button-bg1'>Ночной Город</button>
            <button ref={ref2} onClick={() => theme('city', ref2, 2)} className='theme-button theme-button-bg2'>Горы</button>
            <button ref={ref3} onClick={() => theme('city', ref3, 3)} className='theme-button theme-button-bg3'>Природа</button>
            <button ref={ref4} onClick={() => theme('city', ref4, 4)} className='theme-button theme-button-bg4'>Космос</button> */}
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Придумайте пароль" type="password" className="input" />
            <input value={password2} onChange={(e) => setPassword2(e.target.value)} placeholder="Повторите пароль" type="password" className="input" />
            {/* <p style={{color: 'yellow', fontSize: '16pt'}}>Если у вас стоит блокировщик рекламы, пожалуйста, отключите его на этом сайте. Он мешает корректной работе соцсети.</p> */}
            {error && <span style={{color: 'red'}}>{error}</span>}
            <button ref={regRef} onClick={registerHandler} className="button">Регистрация</button></> : <><p style={{color: 'white'}}>Подождите, пока данные отправятся на сервер...</p><br /><Loader ml={'50%'} /></>}
        </div>
    )
}

export default Register