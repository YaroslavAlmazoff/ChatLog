import React, { useContext, useState } from "react";
import "./styles/header.css";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { userId, authenticated, activated } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState(null);

  const authorizedLinks = [
    { name: "Главная", route: "/home" },
    { name: "Мой профиль", route: `/user/${userId}` },
    { name: "Сообщения", route: "/messages" },
    { name: "Люди", route: "/users" },
    { name: "Настройки", route: "/settings" },
  ];
  const notAuthorizedLinks = [
    { name: "Регистрация", route: "/register" },
    { name: "Вход", route: "/login" },
  ];

  const markLink = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      {activated ? (
        <div className="header" id="header">
          <h2 className="logo">CHATLOG.RU</h2>
          <div className="links">
            {authenticated ? (
              <div className="links">
                {authorizedLinks.map((link) => (
                  <Link
                    onClick={() => markLink(link.route)}
                    to={link.route}
                    className="link"
                    style={
                      activeLink === link.route ||
                      window.location.pathname === link.route
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            ) : (
              <div>
                {notAuthorizedLinks.map((link) => (
                  <Link
                    onClick={markLink}
                    to={link.route}
                    className="link"
                    style={
                      activeLink === link.route ||
                      window.location.pathname === link.route
                        ? { color: "white" }
                        : { color: "black" }
                    }
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};
export default Header;
