import "./styles/Buy.css";
import "./styles/Main.css";

const isMobile =
  /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(
    navigator.userAgent
  );

function Buy() {
  return (
    <div className="art-main">
      <div
        className="art-block art-page-center"
        style={isMobile ? { width: "100%" } : { width: "50%" }}
      >
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          Этапы покупки картин:
        </span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          - Выбрав понравившееся произведение искусства, нажмите кнопку Купить;
        </span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          ( Вы автоматически перейдёте на страницу оформления заказа );{" "}
        </span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          - Заполните форму, чтобы я смогла отправить Вам товар и уведомление об
          отправке;
        </span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          - Оплата за товар покупателем производится при получении им извещения
          (чека) об отправке посылки;
        </span>
        ;
        <span className="art-buy-text">
          - Если в течение…. Времени продавец не получает деньги, отправка
          товара отменяется
        </span>
        <span className="art-buy-text">
          (оплата включает в себя стоимость самой картины и доставки).
        </span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          Важно!
        </span>
        <span className="art-buy-text" style={{ marginTop: "30px" }}>
          Доставка осуществляется с помощью транспортной компании СДЭК
        </span>
        <span className="art-buy-text">по всей России и в страны СНГ.</span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          Перед отправкой картина тщательно упаковывается, что гарантирует
          безопасность и сохранность посылки.
        </span>
        <span className="art-buy-text" style={{ marginTop: "40px" }}>
          По всем интересующим вопросам пишите в мессенжер{" "}
        </span>
        <span className="art-buy-text">или звоните по телефону.</span>
      </div>
    </div>
  );
}

export default Buy;