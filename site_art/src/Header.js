import { Link } from 'react-router-dom';
import './styles/Header.css';
import './styles/Header-mobile.css';

const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);
console.log(isMobile)

function Header() { 
  return (
    <>
    {isMobile ?
    <div className="header-mobile">
      <div className="header-center-mobile">
          <div className="links-mobile">
              <Link className="link-mobile" to="/">Галерея</Link>
              <Link className="link-mobile" to="/contacts">Контакты</Link>
              <Link className="link-mobile" to="/buy">Как купить</Link>
              <Link className="link-mobile" to="/about-author">О художнике и картинах</Link>
              <Link className="link-mobile" to="/reviews">Отзывы</Link>
              <span className="link-mobile"> 8 (904) 539-75-18  </span> 
          </div>
          <img className="logo1-mobile" src={require("./img/logo.png")} />
      </div>

      <div className="header-titles-mobile">
              <img className="header-title-mobile" src={require("./img/header-text1.png")} /> 
              <img className="header-title-mobile" width="200" src={require("./img/header-text2.png")} />  
          </div>
    </div>
 : 
 <div className="header">
        <img className="logo1" src={require("./img/logo.png")} />
        <div className="header-center">
            <div className="links">
                <Link className="link" to="/">Галерея</Link>
                <Link className="link" to="/contacts">Контакты</Link>
                <Link className="link" to="/buy">Как купить</Link>
                <Link className="link" to="/about-author">О художнике и картинах</Link>
                <Link className="link" to="/reviews">Отзывы</Link>
                <span className="link"> 8 (904) 539-75-18  </span> 
            </div>
            <div className="header-titles">
                <img className="header-title" src={require("./img/header-text1.png")} /> 
                <img className="header-title" width="200" src={require("./img/header-text2.png")} />  
            </div>
        </div>
        
    </div>  
  }
    </>
    
  );
}

export default Header;
