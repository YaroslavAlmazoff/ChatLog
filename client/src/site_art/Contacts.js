import "./styles/Contacts.css";

const isMobile =
  /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(
    navigator.userAgent
  );

function Contacts() {
  return (
    <div
      className="art-block art-page-center"
      style={isMobile ? { width: "100%" } : { width: "50%" }}
    >
      <span className="art-contacts-text" style={{ marginTop: "40px" }}>
        По всем вопросам пишите в мессенжер:
      </span>
      <span style={{ textAlign: "center" }}>
        <img className="art-icon-viber" src={require("./img/icon-viber.png")} />
        <img className="art-whatsapp" src={require("./img/whatsapp.png")} />
        <img className="art-telegram" src={require("./img/telegram.png")} />
      </span>
      <br />
      <br />
      <span className="art-contacts-text" style={{ marginTop: "70px" }}>
        Также, вы можете позвонить по телефону:
      </span>
      <span className="art-contacts-text">8 (904) 539 - 75 - 18.</span>
      <span
        className="art-contacts-text"
        style={{ marginTop: "70px", marginBottom: "140px" }}
      >
        Буду рада с Вами пообщаться!
      </span>
    </div>
  );
}

export default Contacts;
