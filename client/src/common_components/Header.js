import React, { useContext, useState } from "react";
import "./styles/header.css";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { userId, authenticated, activated } = useContext(AuthContext);
  const [activeLink, setActiveLink] = useState(null);

  const location = window.location.href;

  console.log(location);

  const authorizedLinks = [
    { name: "Главная", route: "/home", marked: this.route === location },
    {
      name: "Мой профиль",
      route: `/user/${userId}`,
      marked: this.route === location,
    },
    { name: "Сообщения", route: "/messages", marked: this.route === location },
    { name: "Люди", route: "/users", marked: this.route === location },
    { name: "Настройки", route: "/settings", marked: this.route === location },
  ];
  const notAuthorizedLinks = [
    {
      name: "Регистрация",
      route: "/register",
      marked: this.route === location,
    },
    { name: "Вход", route: "/login", marked: this.route === location },
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
                    onClick={markLink}
                    to={link.route}
                    className="link"
                    style={
                      activeLink === link.route
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
                      activeLink === link.route
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
