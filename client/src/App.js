import "./App.css";
import "./common.css";
import { useRoutes } from "./routes";
import Header from "./common_components/Header";
import React, { useEffect, useState } from "react";
import { useAuth } from "./common_hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import api from "./auth/api/auth";
import useDate from "./common_hooks/date.hook";
import $ from "jquery";
import useVerify from "./common_hooks/verify.hook";
import auth from "./auth/api/auth";
import ArtHeader from "./site_art/Header";
import Footer from "./site_art/Footer";
import "./site_art/index.css";
import "./common_components/modal-window/modal-window.css";

function App() {
  const { verify } = useVerify();
  const { token, login, logout, userId } = useAuth();

  const isAuthenticated = !!token;
  const [isVerified, setIsVerified] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const routes = useRoutes(isVerified);
  const { getCurrentDate } = useDate();
  useEffect(() => {
    console.log(window.location.toString().includes("/art"));
    if (window.location.toString().includes("/art")) {
      document.head.insertAdjacentHTML(
        "beforeend",
        `<link rel="stylesheet" href="https://chatlog.ru/logo.png" />`
      );
      document.body.style.backgroundImage = `url(${require("./site_art/img/bg.png")})`;
    }
    const setVisit = async () => {
      const v = await verify();
      setIsVerified(v.isVerified);
      setIsActivated(v.isActivated);
      await api.get("/api/admin/setvisit");
    };
    setVisit();
    const lastVisit = async () => {
      const date = getCurrentDate();
      if (localStorage.getItem("user")) {
        await api.post("/api/lastvisit", { date }, { headers: { token } });
      }
    };
    lastVisit();
  }, []);

  const openWindow = () => {
    setModalOpen(true);
  };

  const closeWindow = () => {
    setModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        logout,
        userId,
        isAuthenticated,
        openWindow,
        closeWindow,
        isOpen: isModalOpen,
      }}
    >
      <div className="App">
        {isModalOpen && <div className="modal-window-overlay"></div>}
        {!window.location.toString().includes("/art") ? (
          <Header isVerified={isVerified} isActivated={isActivated} />
        ) : (
          <ArtHeader />
        )}
        {routes}
        {window.location.toString().includes("/art") ? <Footer /> : <></>}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

//Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
