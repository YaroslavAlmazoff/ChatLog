import { Link } from 'react-router-dom'
import './landing-page.css'

const LandingPage = () => {

    return (
        <div className='landing_page'>
            <img className='landing_page_icon_1' src={require('./img/landing_page_image_3.png')} alt="img" />
            <h1 className='landing_page_title'>Социальная сеть Chatlog.ru</h1>
            <hr style={{width: '25%', borderColor: 'rgb(0, 140, 255)', backgroundColor: 'rgb(0, 140, 255)'}} />
            <ul className='landing_page_list'>
                <li className='landing_page_list_item'>Игры</li>
                <li className='landing_page_list_item'>Новости для геймеров</li>
                <li className='landing_page_list_item'>Удобный мессенджер</li>
                <li className='landing_page_list_item'>Файловое хранилище</li>
                <li className='landing_page_list_item'>Объявления о продаже игровых аккаунтов</li>
                <li className='landing_page_list_item'>Реклама игр</li>
            </ul>
            <hr style={{width: '10%', borderColor: 'rgb(0, 140, 255)'}} />
            <div className='landing_page_actions'>
                {/*<a href={require('./apk/app-release.apk')} className='landing_page_action' download="ChatLog">Скачать приложение</a>*/}
                <Link className='landing_page_action' to='/register'>Зарегистрироваться</Link>
                <Link className='landing_page_action' to='/login'>Войти</Link>
            </div>
            <div className='landing_page_image_wrapper'>
                <img className='landing_page_image' src={require('./img/landing_page_image_2.jpg')} alt='landing page' />
            </div>
            <p className='landing_page_text'>Chatlog.ru - это уютная и безопасная 
            социальная сеть для геймеров. Здесь можно вести свой блог, создать свой канал, заводить друзей, 
            переписываться, обмениваться файлами, в удобной форме создавать
            и выкладывать объявления о продаже игровых аккаунтов и тп.</p>
            <div className='landing_page_support'>
                <p>Если возникла проблема с 
                работоспособностью соцсети, вы нашли баг или ошибку, пожалуйста,
                сообщите об этом <Link className='landing_page_support_link' to='/support'>нам</Link>. Мы быстро исправим проблему.
                </p>
            </div>
        </div>
    )
}

export default LandingPage