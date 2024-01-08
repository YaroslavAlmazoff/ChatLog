import pictures from "./pictures";
import "./styles/Buy.css";

const ZakazPicture = ({ index }) => {
  const picture = pictures[index];

  return (
    <div className="art-zakaz-picture-parent">
      <div className="art-zakaz-picture">
        <img
          src={process.env.REACT_APP_API_URL + "/" + picture.image}
          className="art-zakaz-image"
        />
      </div>
      <span style={{ width: "250%" }}>
        <p className="art-buy-text2">Картина: ‹‹{picture.title}››</p>
        <p className="art-buy-text2">{picture.technic}</p>
        <p className="art-buy-text2">{picture.size}</p>
        <br />
        <br />
        <br />
        <p className="art-buy-text2">Итого: {picture.price}₽</p>
      </span>
    </div>
  );
};

export default ZakazPicture;
