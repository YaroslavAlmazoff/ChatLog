import "./styles/AboutAuthor.css";

const isMobile =
  /Mobile|webOS|BlackBerry|IEMobile|MeeGo|mini|Fennec|Windows Phone|Android|iP(ad|od|hone)/i.test(
    navigator.userAgent
  );

function AboutAuthor() {
  return (
    <div className="art-main">
      <div
        className="art-block art-page-center"
        style={isMobile ? { width: "100%" } : { width: "60%" }}
      >
        <span className="art-aboutAuthor-text" style={{ marginTop: "10px" }}>
          Здравствуйте! Меня зовут Светлана Кижаева,
          <br /> я универсальный художник,
        </span>
        <span className="art-aboutAuthor-text">
          создаю картины в любом стиле, жанре и технике.{" "}
        </span>
        <span className="art-aboutAuthor-text">
          Опыт в создании картин более 10 лет. За это время было продано более
          170 эксклюзивных художественных работ.
        </span>
        <span className="art-aboutAuthor-text">
          Живопись - это смысл моей жизни, поэтому каждую картину я создаю с
          особым трепетом и любовью.
        </span>
        <span className="art-aboutAuthor-text" style={{ marginTop: "40px" }}>
          Работы выполнены акриловыми красками.
          <br />
          В объёмном декорировании использованы глина и
          <br />
          текстурная паста.
          <br />
          Все материалы качественные и экологичные.
          <br />
          Грунтованный холст на прочном деревянном подрамнике исключает
          провисание холста и любую деформацию.
          <br />
          Краски не подлежат выцветанию и
          <br />
          сохраняют яркость цвета надолго.
          <br />
          Все работы покрыты акриловым лаком.
        </span>
        <span className="art-aboutAuthor-text" style={{ marginTop: "40px" }}>
          Картина ручной работы — это лучший подарок для Ваших близких, друзей и
          коллег.
        </span>
        <span className="art-aboutAuthor-text" style={{ marginTop: "20px" }}>
          Они преобразят любой интерьер от прихожей до детской комнаты и будут
          дарить яркие и позитивные эмоции Вам и Вашим близким!
        </span>
      </div>
    </div>
  );
}

export default AboutAuthor;
