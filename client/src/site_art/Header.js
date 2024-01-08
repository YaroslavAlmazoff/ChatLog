import { Link } from "react-router-dom";
import "./styles/Header.css";
import "./styles/Header-mobile.css";

const isMobile =
  /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(
    navigator.userAgent
  );
console.log(isMobile);

function Header() {
  return (
    <>
      {isMobile ? (
        <div className="art-header-mobile">
          <div className="art-header-center-mobile">
            <div className="art-links-mobile">
              <Link className="art-link-mobile" to="/art">
                Галерея
              </Link>
              <Link className="art-link-mobile" to="/art/contacts">
                Контакты
              </Link>
              <Link className="art-link-mobile" to="/art/buy">
                Как купить
              </Link>
              <Link className="art-link-mobile" to="/art/about-author">
                О художнике и картинах
              </Link>
              {/* <Link className="link-mobile" to="/art/reviews">
                Отзывы
              </Link> */}
              <span className="art-link-mobile"> 8 (904) 539-75-18 </span>
            </div>
            <img className="art-logo1-mobile" src={require("./img/logo.png")} />
          </div>

          <div className="art-header-titles-mobile">
            <img
              className="art-header-title-mobile"
              src={require("./img/header-text1.png")}
            />
            <img
              className="art-header-title-mobile"
              width="200"
              src={require("./img/header-text2.png")}
            />
          </div>
        </div>
      ) : (
        <div className="art-header">
          <img className="art-logo1" src={require("./img/logo.png")} />
          <div className="art-header-center">
            <div className="art-links">
              <Link className="art-link" to="/art">
                Галерея
              </Link>
              <Link className="art-link" to="/art/contacts">
                Контакты
              </Link>
              <Link className="art-link" to="/art/buy">
                Как купить
              </Link>
              <Link className="art-link" to="/art/about-author">
                О художнике и картинах
              </Link>
              {/* <Link className="link" to="/art/reviews">
                Отзывы
              </Link> */}
              <span className="art-link"> 8 (904) 539-75-18 </span>
            </div>
            <div className="art-header-titles">
              <img
                className="art-header-title"
                src={require("./img/header-text1.png")}
              />
              <img
                className="art-header-title"
                width="200"
                src={require("./img/header-text2.png")}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
