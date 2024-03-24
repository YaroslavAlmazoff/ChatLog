import useVerify from "./common_hooks/verify.hook";
import { useEffect } from "react";
import "./settings.css";
import "./auth/styles/form.css";

const Settings = () => {
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);
  const logout = () => {
    localStorage.removeItem("user");
    window.location = "/";
  };
  const deleteProfile = () => {
    window.location = "/deleteprofile";
  };

  return (
    <div className="settings-wrapper">
      <div className="settings block">
        <h2 className="form-title">Настройки</h2>
        <div className="setting-buttons">
          <button onClick={logout} className="button">
            Выйти
          </button>
          <button onClick={deleteProfile} className="button ml">
            Удалить профиль
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
