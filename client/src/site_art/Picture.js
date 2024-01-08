import { useEffect, useState } from "react";
import "./styles/Picture.css";
import "./styles/Block.css";
import { useParams } from "react-router";
import pictures from "./pictures";

const Picture = () => {
  const params = useParams();
  const [picture, setPicture] = useState({ photos: [] });
  useEffect(() => {
    setPicture(pictures[params.id]);
  }, [params]);
  const buy = () => {
    const id = Math.round(Math.random() * 1000000000);
    window.location = `/art/zakaz/${id}/${params.id}`;
  };
  return (
    <div className="art-page-center bg">
      <p className="art-picture-title">{picture.title}</p>
      <div className="art-center">
        {picture.photos.map((photo) => (
          <img
            height="300"
            style={{
              marginLeft: "50px",
              border: "2px solid white",
              borderRadius: "15px",
            }}
            src={process.env.REACT_APP_API_URL + "/additional/" + photo}
          />
        ))}
      </div>
      <p className="art-text-title art-picture-description">
        {picture.description}
      </p>

      {picture.decoration ? (
        <span className="art-text-title" style={{ marginTop: "40px" }}>
          {" "}
          Выполнено в технике: объёмное декорирование;{" "}
        </span>
      ) : (
        <></>
      )}
      <span className="art-text-title">
        {" "}
        Используемые материалы: {picture.technic};
      </span>
      <span className="art-text-title">
        {" "}
        Размер картины: {picture.size} см;
      </span>
      <span className="art-text-title">
        {" "}
        На обратной стороне картины имеются крепления.
      </span>
      <span className="art-text-title" style={{ marginTop: "40px" }}>
        Цена: {picture.price} руб.
      </span>
      <button
        className="art-button"
        style={{ marginTop: "15px", marginBottom: "30px" }}
        onClick={buy}
      >
        Купить
      </button>
    </div>
  );
};

export default Picture;
