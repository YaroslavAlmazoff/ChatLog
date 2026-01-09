import "./styles/head.css";
import { useRef, useEffect, useState, useContext, useCallback } from "react";
import useDaytime from "../hooks/daytime.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";

const Head = () => {
  const { token } = useContext(AuthContext);
  const { getDaytime } = useDaytime();
  const [user, setUser] = useState({ name: "name" });
  let clockRef = useRef(null);
  useEffect(() => {
    const interval = setInterval(() => {
      let now = new Date();
      clockRef.current.innerHTML = now.toLocaleTimeString();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const getUser = useCallback(async () => {
    if (!token) return;
    console.log(token);
    const response = await api.get("/api/user-by-token", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response); // {verified: false}
    setUser(response.data.user);
  }, [token]);

  useEffect(() => {
    getUser();
  }, [getUser]);
  return (
    <div className="head">
      {window.screen.width > 700 ? (
        <div className="daytime">
          <h2 className="time">
            {user.name ? getDaytime(user.name) : ""}&nbsp;&nbsp;&nbsp;&nbsp;
          </h2>
          <div ref={clockRef} className="time"></div>
        </div>
      ) : (
        <></>
      )}
      {window.screen.width < 700 && window.screen.width > 500 ? (
        <div className="daytime">
          <p className="time">
            {user.name ? getDaytime(user.name) : ""}&nbsp;&nbsp;&nbsp;&nbsp;
          </p>
          <div ref={clockRef} className="time"></div>
        </div>
      ) : (
        <></>
      )}
      {window.screen.width < 500 ? (
        <div className="daytime">
          <p className="time white-glow-text">
            {user.name ? getDaytime(user.name) : ""}
          </p>
          <div ref={clockRef} className="time white-glow-text"></div>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Head;
