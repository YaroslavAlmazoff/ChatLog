import { useState, useContext } from "react";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";

const DeleteProfile = () => {
  const auth = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const send = async () => {
    const response = await api.post(
      "/api/deleteprofile",
      { password },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    if (response.data.error) {
      setError(response.data.error);
    } else {
      localStorage.removeItem("user");
      localStorage.removeItem("registered");
      window.location = "/greeting";
    }
  };
  return (
    <div style={{ marginTop: "20vh" }} className="block block-form">
      <span className="white-glow-text">
        Вы уверены, что хотите удалить свой профиль?
      </span>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input"
        placeholder="Введите пароль"
      />
      <button className="button-neon-red" onClick={send}>
        Удалить
      </button>
      <span style={{ color: "#FF073A" }}>{error}</span>
    </div>
  );
};

export default DeleteProfile;
