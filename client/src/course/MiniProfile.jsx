import { useContext, useEffect, useRef, useState } from "react";
import api from "../auth/api/auth";
import { AuthContext } from "../context/AuthContext";
import "./styles/mini-profile.css";

const MiniProfile = () => {
  const { userId, token } = useContext(AuthContext);
  const [user, setUser] = useState({
    paid: false,
    courseMemberID: "Загрузка...",
  });
  const [name, setName] = useState("Загрузка...");
  const [avatarUrl, setAvatarUrl] = useState("Загрузка...");
  const fileRef = useRef();

  useEffect(() => {
    const getUser = async () => {
      const response = await api.get(`/api/user/${userId}`);
      const user = response.data.user;
      setUser(user);
      setName(user.name);
      setAvatarUrl(user.avatarUrl);
    };
    getUser();
  }, []);

  const emitOpen = () => {
    fileRef.current.click();
  };
  const getFile = async (e) => {
    setLoading(true);
    let file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    const response = await api.post(`/api/editprofile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    setAvatarUrl(response.data.avatarUrl);
    setLoading(false);
  };

  const updateNameHandler = async () => {
    setLoading(true);
    await api.post(
      `/api/editprofile`,
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setLoading(false);
  };

  return (
    <div className="mini-profile">
      <span>
        <p>Профиль</p>
      </span>
      <span>
        <span className="mini-profile-property">Имя: </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ваше имя..."
        />
        <span onClick={updateNameHandler} className="mini-profile-ok">
          OK
        </span>
      </span>
      <span>
        <span className="mini-profile-property">Статус курса: </span>
        <span className="mini-profile-property-value">
          {user.paid ? "Полностью доступен" : "Только открытые уроки"}
        </span>
      </span>
      {user.paid && user.courseMemberID ? (
        <span>
          <span className="mini-profile-property">Ваш ID участника: </span>
          <span className="mini-profile-property-value">
            #{user.courseMemberID.toUpperCase()}
          </span>
        </span>
      ) : (
        <></>
      )}
      <img
        onClick={emitOpen}
        src={process.env.REACT_APP_API_URL + "/useravatars/" + avatarUrl}
      />
      <input onChange={(e) => getFile(e)} ref={fileRef} type="file" />
    </div>
  );
};

export default MiniProfile;
