import { useState } from "react";
import "./styles/Block.css";
import "./index.css";
import pictures from "./pictures";

function Block({ title, technic, size, price, image, sold, index }) {
  const goToPicture = () => {
    if (!sold) {
      window.location = `/art/picture/${index}`;
    }
  };
  const buy = () => {
    const id = Math.round(Math.random() * 1000000000);
    window.location = `/art/zakaz/${id}/${index}`;
  };
  return (
    <div className="art-block">
      <img
        onClick={goToPicture}
        className="art-image"
        src={process.env.REACT_APP_API_URL + "/" + image}
      />
      <span className="title" style={{ marginTop: "10px" }}>
        ‹‹{title}››
      </span>
      <br />
      <span className="block-description" style={{ marginTop: "1px" }}>
        {technic}
      </span>
      <br />
      <span className="block-description" style={{ marginTop: "1px" }}>
        {size} см
      </span>
      <div className="art-block-text">
        <p className="art-block-description"> {price} руб. </p>
        {sold ? (
          <p className="art-red">Продано</p>
        ) : (
          <button className="art-button" onClick={buy}>
            Купить
          </button>
        )}
      </div>
    </div>
  );
}

export default Block;
