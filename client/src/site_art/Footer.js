import "./styles/Footer.css";

function Footer() {
  return (
    <div className="art-footer">
      <img className="art-logo" src={require("./img/logo.png")} />
      <span className="art-footer-text">
        Художественная мастерская Светланы Кижаевой
        <br />
        Телефон: 8 (904) 539-75-18
        <br />
        <span>&copy; 2024</span>
      </span>
      <span className="art-footer-text">
        Сайт одного художника
        <br />
        Соц.сети:
        <a target="_blank" href="https://vk.com/club220893328">
          <img className="art-vkontakte" src={require("./img/vk.png")} />
        </a>
        <img className="art-icon-viber" src={require("./img/icon-viber.png")} />
        <img className="art-whatsapp" src={require("./img/whatsapp.png")} />
        <img className="art-telegram" src={require("./img/telegram.png")} />
      </span>

      <img className="art-sdelka" src={require("./img/sdelka.png")} />
    </div>
  );
}

export default Footer;
