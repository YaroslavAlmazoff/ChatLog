import React, { useState, useContext, useRef, useEffect } from "react";
import "./styles/form.css";
import api from "./api/auth";
import { AuthContext } from "../context/AuthContext";
import Loader from "../common_components/Loader";

const Register = () => {
  const regRef = useRef(null);
  const auth = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const registerHandler = async () => {
    if (!name) {
      setError("Введите имя");
      return;
    }
    if (!surname) {
      setError("Введите фамилию");
      return;
    }
    if (!email) {
      setError("Введите почту");
      return;
    }
    if (!password || !password2) {
      setError("Где-то не введен пароль");
      return;
    }
    if (password !== password2) {
      setError("Пароли не совпадают");
      return;
    }
    regRef.current.disabled = true;
    setLoading(true);

    const response = await api.post("/api/auth/register", {
      name,
      surname,
      age,
      email,
      country,
      city,
      password,
      site: true,
    });

    const { token, userId, errors } = response.data;

    if (!errors.length) {
      auth.login(token, userId);
      localStorage.setItem("registered", true);
      window.location = `/notactivated`;
    } else {
      setError(response.data.errors.join(". "));
      setLoading(false);
    }
  };

  return (
    <div className="form">
      <h2 className="white-glow-text">Регистрация</h2>
      {!loading ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            type="text"
            className="input"
          />
          <input
            value={surname}
            onChange={(e) => setSurName(e.target.value)}
            placeholder="Введите фамилию"
            type="text"
            className="input"
          />
          <p className="white-glow-text">Введите дату рождения</p>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Выберите возраст"
            type="date"
            className="input"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите свой email"
            type="email"
            className="input"
          />
          <input
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Введите свою страну (необязательно)"
            type="text"
            className="input"
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Введите свой город (необязательно)"
            type="text"
            className="input"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Придумайте пароль"
            type="password"
            className="input"
          />
          <input
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            placeholder="Повторите пароль"
            type="password"
            className="input"
          />
          {error && <span style={{ color: "red" }}>{error}</span>}
          <button ref={regRef} onClick={registerHandler} className="button">
            Регистрация
          </button>
        </>
      ) : (
        <>
          <p style={{ color: "white" }}>
            Подождите, пока данные отправятся на сервер...
          </p>
          <br />
          <Loader ml={"50%"} />
        </>
      )}
    </div>
  );
};

export default Register;
