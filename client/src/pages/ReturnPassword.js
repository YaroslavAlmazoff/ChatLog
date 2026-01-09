import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../auth/api/auth";

const ReturnPassword = () => {
  const params = useParams();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const getUser = async () => {
      const user = await api.get(`/api/user/${params.id}`);
      if (!user.data.user.returnLink == params.link) {
        window.location = "/greeting";
      }
    };
    getUser();
  }, [params]);
  const returnPassword = async () => {
    const response = await api.post(`/api/return-password`, {
      password,
      id: params.id,
      link: params.link,
    });
    if (response.data.ok) {
      window.location = "/login";
    } else {
      setError("Неверная ссылка. Попробуйте еще");
    }
  };
  return (
    <div className="form">
      <input
        placeholder="Введите новый пароль"
        type="password"
        value={password}
        className="input"
        onChange={(e) => setPassword(e.target.value)}
      />
      {error != "" ? <p style={{ color: "red" }}>{error}</p> : <></>}
      <button onClick={returnPassword} className="button">
        Сохранить пароль
      </button>
    </div>
  );
};

export default ReturnPassword;
