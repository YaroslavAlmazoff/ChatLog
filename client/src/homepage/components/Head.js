import "./styles/head.css";
import { useRef, useEffect, useState, useContext, useCallback } from "react";
import useDaytime from "../hooks/daytime.hook";
import api from "../../auth/api/auth";
import { AuthContext } from "../../context/AuthContext";

const Head = () => {
  const { token } = useContext(AuthContext);
  const { getDaytime } = useDaytime();
  const [user, setUser] = useState({ name: "name" });
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 500);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 500);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      if (!token) return;
      const response = await api.get("/api/user-by-token", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    };
    getUser();
  }, []);
  return (
    <div className="head">
      <div className="daytime">
        <h2 className={`time ${isMobile ? "white-glow-text" : ""}`}>
          {user.name ? getDaytime(user.name) : ""}
        </h2>
        {!isMobile ? (
          <div style={{ marginRight: "20px" }} className="time">
            {time}
          </div>
        ) : (
          <div className="time white-glow-text">{time}</div>
        )}
      </div>
    </div>
  );
};

export default Head;
