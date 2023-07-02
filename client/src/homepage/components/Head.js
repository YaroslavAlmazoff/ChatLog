import "./styles/head.css";
import { useRef, useEffect, useState, useContext } from "react";
import useDaytime from "../hooks/daytime.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";
import useVerify from "../../common_hooks/verify.hook";

const Head = () => {
  const auth = useContext(AuthContext);
  const { getDaytime } = useDaytime();
  const [user, setUser] = useState({ name: "name" });
  let clockRef = useRef(null);
  useEffect(() => {
    setInterval(() => {
      let now = new Date();
      clockRef.current.innerHTML = now.toLocaleTimeString();
    }, 1000);
  }, []);

  useEffect(() => {
    console.log(auth);
    const getUser = async () => {
      if (!auth.userId || !auth.token) return;
      console.log(auth);
      const response = await api.get("/api/user", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response);
      setUser(response.data.user);
    };
    getUser();
  }, [auth]);

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
