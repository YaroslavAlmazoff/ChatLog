import { useContext, useEffect, useRef, useState } from "react";
import api from "../auth/api/auth";
import { AuthContext } from "../context/AuthContext";
import "./styles/mini-profile.css";
import Loader from "../common_components/Loader";

const MiniProfile = () => {
  const { userId, token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    paid: false,
    courseMemberID: "Загрузка...",
  });
  const [name, setName] = useState("Загрузка...");
  const [avatarUrl, setAvatarUrl] = useState("Загрузка...");
  const fileRef = useRef();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);
      const response = await api.get(`/api/user/${userId}`);
      const user = response.data.user;
      setUser(user);
      setName(user.name);
      setAvatarUrl(user.avatarUrl);
      setLoading(false);
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
      <span
        style={{ cursor: "pointer" }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="mini-profile-title">
          Профиль&nbsp;
          <span
            style={{
              display: "inline-block",
              marginRight: 8,
              transition: "transform 0.2s",
              transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
            }}
          >
            ▶
          </span>
        </span>
      </span>
      {isOpen ? (
        <>
          {!loading ? (
            <>
              <div className="mini-profile-name-row">
                <span className="mini-profile-property">Имя: </span>
                <input
                  className="input mini-profile-field"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ваше имя..."
                />
                <span onClick={updateNameHandler} className="mini-profile-ok">
                  OK
                </span>
              </div>
              <span>
                <span className="mini-profile-property">Статус курса: </span>
                <span
                  className="mini-profile-property-value"
                  style={{ color: user.paid ? "#86ed26" : "#ff083a" }}
                >
                  {user.paid ? "Полностью доступен" : "Только открытые уроки"}
                </span>
              </span>
              {user.paid && user.courseMemberID ? (
                <span>
                  <span className="mini-profile-property">
                    Ваш ID участника:{" "}
                  </span>
                  <span className="mini-profile-property-value">
                    #{user.courseMemberID.toUpperCase()}
                  </span>
                </span>
              ) : (
                <></>
              )}
              <div className="mini-profile-avatar-container">
                <img
                  onClick={emitOpen}
                  className="mini-profile-avatar"
                  src={
                    process.env.REACT_APP_API_URL + "/useravatars/" + avatarUrl
                  }
                />
                <input onChange={(e) => getFile(e)} ref={fileRef} type="file" />
              </div>
            </>
          ) : (
            <Loader />
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default MiniProfile;
