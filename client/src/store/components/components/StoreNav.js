import '../../styles/nav.css'

const StoreNav = () => {
    const go = (name) => {
        window.location = `/store/${name}`
    }
    return (
        <div className="store-nav">
            <p className="store-nav-title">ChatLog Store</p>      
            <div className="store-nav-links">
                <div className="store-nav-links-left">
                    <div className="store-nav-link" onClick={() => go('')}>
                        <img className="store-nav-link-icon" src={require('../../img/store.png')} alt="" />
                        <span className="store-nav-link-name">Главная</span>
                    </div>
                    <div className="store-nav-link" onClick={() => go('basket')}>
                        <img className="store-nav-link-icon" src={require('../../img/basket.png')} alt=""/>
                        <span className="store-nav-link-name">Корзина</span>
                    </div>
                </div>
                <div className="store-nav-link" onClick={() => go('admin')}>
                    <img className="store-nav-link-icon" src={require('../../img/admin.png')} alt="" />
                    <span className="store-nav-link-name">Админ панель</span>
                </div>
            </div>      
        </div>
    )
}

export default StoreNav