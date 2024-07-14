import React, { useContext, useEffect, useState } from "react";
import "./styles/header.css";
import { useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../auth/api/auth";
import { Link } from "react-router-dom";

const Header = () => {
  const auth = useContext(AuthContext);
  const authorizedRef = useRef();
  const notAuthorizedRef = useRef();

  const isActivated = true;

  const location = window.location.href;

  console.log(location);

  const [authorizedLinks, setAuthorizedLinks] = useState([
    { name: "Главная", route: "/home", marked: this.route === location },
    {
      name: "Мой профиль",
      route: "/user/" + auth.userId,
      marked: this.route === location,
    },
    { name: "Сообщения", route: "/messages", marked: this.route === location },
    { name: "Люди", route: "/users", marked: this.route === location },
    { name: "Настройки", route: "/settings", marked: this.route === location },
  ]);
  const [notAuthorizedLinks, setNotAuthorizedLinks] = useState([
    {
      name: "Регистрация",
      route: "/register",
      marked: this.route === location,
    },
    { name: "Вход", route: "/login", marked: this.route === location },
  ]);

  const [activeLink, setActiveLink] = useState(null);

  const markLink = (link) => {
    setActiveLink(link);
  };

  return (
    <>
      {isActivated ? (
        <div className="header" id="header">
          <h2 className="logo">CHATLOG.RU</h2>
          <div className="links">
            {auth.authenticated ? (
              <div className="links">
                {authorizedLinks.map((link) => (
                  <Link
                    onClick={markLink}
                    ref={authorizedRef}
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
                    ref={notAuthorizedRef}
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
