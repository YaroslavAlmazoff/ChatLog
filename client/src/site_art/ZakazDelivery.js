import axios from "axios";
import { useState } from "react";

const ZakazDelivery = ({ picture, price }) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [comment, setComment] = useState("");

  const buy = async () => {
    const reponse = await axios.post("https://chatlog.ru/api/art/send-data", {
      picture,
      price,
      name,
      surname,
      email,
      phone,
      address1,
      address2,
      delivery: address1 ? "Доставка курьером" : "Доставка в пункт выдачи",
      comment,
    });
    console.log(reponse);
  };

  return (
    <>
      <div className="art-zakaz-form">
        <p
          className="art-zakaz-form-text"
          style={{ marginTop: "40px", textDecoration: "underline" }}
        >
          Покупатель
        </p>
        <div className="art-zakaz-form-fields">
          <input
            onChange={(e) => setSurname(e.target.value)}
            className="art-zakaz-form-field1"
            type="text"
            placeholder="Фамилия"
          />
          <input
            onChange={(e) => setName(e.target.value)}
            className="art-zakaz-form-field1"
            type="text"
            placeholder="Имя"
          />
        </div>
        <div className="zakaz-form-fields">
          <input
            onChange={(e) => setPhone(e.target.value)}
            className="art-zakaz-form-field1"
            type="phone"
            placeholder="Телефон"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            className="art-zakaz-form-field1"
            type="email"
            placeholder="E-mail"
          />
        </div>

        <span className="art-zakaz-form-text" style={{ fontSize: "14pt" }}>
          Адрес доставки курьером СДЭК
        </span>
        <input
          onChange={(e) => setAddress1(e.target.value)}
          className="art-zakaz-form-field2"
          type="email"
          placeholder="Укажите полностью адрес (с индексом) для доставки курьером"
        />
        <span className="art-zakaz-form-text" style={{ fontSize: "14pt" }}>
          Адрес пункта выдачи СДЭК
        </span>
        <input
          onChange={(e) => setAddress2(e.target.value)}
          className="art-zakaz-form-field2"
          type="email"
          placeholder="Укажите полностью адрес пункта выдачи СДЭК"
        />
        <textarea
          onChange={(e) => setComment(e.target.value)}
          placeholder="Комментарий"
        ></textarea>
      </div>
      <div className="art-zakaz-delivery">
        <span
          className="art-zakaz-form-text"
          style={{ textDecoration: "underline" }}
        >
          Способ доставки
        </span>
        <span
          className="art-zakaz-form-text"
          style={{ fontSize: "16pt", marginTop: "65px" }}
        >
          Доставка осуществляется ТК СДЭК.
          <br />
          <br />
          Для доствки курьером заполните поле
          <br />
          <span style={{ color: "rgb(251, 221, 255)" }}>
            "Адрес доставки курьером СДЭК"
          </span>
          .
          <br />
          <br />
          Для доставки в пункт выдачи заполните поле
          <br />
          <span style={{ color: "rgb(251, 221, 255)" }}>
            "Адрес пункта выдачи СДЭК"
          </span>
          .
          <br />
        </span>
        <span className="art-zakaz-form-text" style={{ fontSize: "16pt" }}>
          Найти удобный пункт выдачи можно по ссылке: <br />
          <a
            style={{ marginLeft: "5px", color: "rgb(251, 221, 255)" }}
            href="https://www.cdek.ru/offices/"
            target="_blank"
          >
            <span>https://www.cdek.ru/offices/</span>
          </a>
          .
        </span>
        <button
          onClick={buy}
          className="art-button"
          style={{ marginTop: "15px", marginBottom: "30px", width: "80%" }}
        >
          Оформить заказ
        </button>
      </div>
    </>
  );
};

export default ZakazDelivery;
