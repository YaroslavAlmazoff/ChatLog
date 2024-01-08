import Block from "./Block";
import "./styles/Main.css";
import pictures from "./pictures";

function Main({ number, setNumber }) {
  return (
    <div className="art-main">
      <div className="art-top">
        <span className="art-welcome" style={{ marginTop: "10px" }}>
          Добро пожаловать в мою художественную мастерскую!
        </span>
        <br />
        <span className="art-welcome">
          Рада предложить вам свои картины ручной работы разной тематики и
          жанров.
        </span>
      </div>
      <div className="art-blocks">
        {pictures.map((picture, i) => (
          <Block
            title={picture.title}
            technic={picture.technic}
            size={picture.size}
            price={picture.price}
            image={picture.image}
            sold={picture.sold}
            index={i}
            number={number}
            setNumber={setNumber}
          />
        ))}
        <br />
      </div>
      <div className="art-bottom">
        <span className="art-slogan" style={{ marginTop: "10px" }}>
          Хотите больше радости и счастья?
        </span>
        <br />
        <span className="art-slogan">Окружайте себя яркими картинами.</span>
        <br />
        <span className="art-slogan">
          Такие картины всегда несут позитив, вдохновение и отличное настроение!
        </span>
      </div>
    </div>
  );
}

export default Main;
