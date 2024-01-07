import './styles/Buy.css';

const isMobile = /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(navigator.userAgent);

function Buy() { 
    return (
      <div className="block page-center" style={isMobile ? {width: "100%"} : {width: "50%"}}>
        <span className="buy-text" style={{marginTop: "40px"}}>Этапы покупки картин:</span>
        <span className="buy-text" style={{marginTop: "40px"}}>- Выбрав понравившееся произведение искусства, нажмите кнопку Купить;</span>
        <span className="buy-text" style={{marginTop: "40px"}}>( Вы автоматически перейдёте на страницу оформления заказа ); </span>
        <span className="buy-text" style={{marginTop: "40px"}}>- Заполните форму, чтобы я смогла отправить Вам товар и уведомление об отправке;</span>
        <span className="buy-text" style={{marginTop: "40px"}}>- Оплата за товар покупателем  производится при получении им извещения (чека) об отправке посылки;</span>;
        <span className="buy-text">- Если в течение…. Времени продавец не получает деньги, отправка товара отменяется</span>
        <span className="buy-text">(оплата включает в себя стоимость самой картины и доставки).</span>
       
        <span className="buy-text"style={{marginTop: "40px"}}>Важно!</span>
        <span className="buy-text" style={{marginTop: "30px"}}>Доставка осуществляется с помощью транспортной компании СДЭК</span>
        <span className="buy-text">по всей России и в страны СНГ.</span> 
        <span className="buy-text" style={{marginTop: "40px"}}>Перед отправкой картина тщательно упаковывается, что гарантирует безопасность и сохранность посылки.</span>
        <span className="buy-text" style={{marginTop: "40px"}}>По всем интересующим вопросам пишите в мессенжер </span>
        <span className="buy-text">или звоните по телефону.</span>
      
      </div>
    );
}
  
export default Buy;
