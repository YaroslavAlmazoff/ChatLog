const Header = () => {
    const goTo = (link) => {
        window.location = link
    }
    return (
        <div className="header">
            <span className="header-brand">ArtShop</span>
            <button onClick={() => goTo('/')} className="header-link">Главная</button>
            <button onClick={() => goTo('/contacts')} className="header-link">Контакты</button>
            <button onClick={() => goTo('/about')} className="header-link">О нас</button>
        </div>
    )
}

export default Header