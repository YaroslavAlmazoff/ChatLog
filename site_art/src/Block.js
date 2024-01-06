import { useState } from 'react';
import './styles/Block.css';
import pictures from './pictures';

function Block({title, technic, size, price, image, sold, index}) { 
  const goToPicture = () => {
    if(!sold) {
      window.location = `/picture/${index}`
    }
  }
    const buy = () => {
      const id = Math.round(Math.random() * 1000000000)
      window.location = `/zakaz/${id}/${index}`
    }
    return (
      <div className="block">
        <img onClick={goToPicture} className="image" src={image} />
        <span className="title" style={{marginTop: "10px"}}>‹‹{title}››</span>
        <br />
        <span className="block-description" style={{marginTop: "1px"}}>{technic}</span>
        <br />
        <span className="block-description" style={{marginTop: "1px"}}>{size} см</span>
        <div className="block-text">
        <p className="block-description"> {price} руб. </p>
        {sold ? <p className="red">Продано</p> : <button className="button" onClick={buy}>Купить</button>}
        </div>
      </div>
    );
}

export default Block;