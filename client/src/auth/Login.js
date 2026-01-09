import React, { useContext, useState } from "react";
import "./styles/form.css";
import api from "./api/auth";
import { AuthContext } from "../context/AuthContext";
import Loader from "../common_components/Loader";

const Login = () => {
  const auth = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler = async () => {
    setLoading(true);
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    const { token, userId, errors } = response.data;
    auth.login(token, userId);

    if (!errors.length) {
      window.location = `/home`;
    } else {
      setError(errors.join(". "));
      setLoading(false);
    }
  };

  return (
    <div className="full-width">
      <div className="form">
        <h2 className="white-glow-text">Вход</h2>
        {!loading ? (
          <>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Введите свой email"
              type="email"
              className="input"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              type="password"
              className="input"
            />
            {error && <span style={{ color: "red" }}>{error}</span>}
            <button onClick={loginHandler} className="button">
              Войти
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
    </div>
  );
};

export default Login;
