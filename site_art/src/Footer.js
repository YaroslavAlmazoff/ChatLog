import './styles/Footer.css';


function Footer() { 
  return (
    <div className="footer">
        <img className="logo" src={require("./img/logo.png")} />
        <span className="footer-text">Художественная мастерская Светланы Кижаевой 
        <br />
         Телефон: 8 (904) 539-75-18  
         <br />
         <span>&copy; 2024</span>
         </span>
         <span className="footer-text">Сайт одного художника
         <br />
         Соц.сети:
         <a target="_blank" href="https://vk.com/club220893328"><img className="vkontakte" src={require("./img/vk.png")} /></a>
         <img className="icon-viber" src={require("./img/icon-viber.png")} />
         <img className="whatsapp" src={require("./img/whatsapp.png")} />
         <img className="telegram" src={require("./img/telegram.png")} />
         
        </span>

      <img className="sdelka" src={require("./img/sdelka.png")} />
         
        
    </div>
  );
}

export default Footer;