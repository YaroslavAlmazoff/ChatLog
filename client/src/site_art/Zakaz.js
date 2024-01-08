import { useParams } from "react-router";
import ZakazDelivery from "./ZakazDelivery";
import ZakazPicture from "./ZakazPicture";
import "./styles/Zakaz.css";
import "./styles/Buy.css";
import "./styles/Main.css";
import pictures from "./pictures";

const Zakaz = () => {
  const params = useParams();
  const picture = pictures[params.i];

  return (
    <div className="art-main">
      <div
        className="art-zakaz"
        style={{ color: "white", textDecoration: "underline" }}
      >
        <p className="art-zakaz-text">Оформление заказа</p>
        <ZakazPicture index={params.i} />
        <div className="art-zakaz-bottom">
          <ZakazDelivery picture={picture.title} price={picture.price} />
        </div>
      </div>
    </div>
  );
};

export default Zakaz;
