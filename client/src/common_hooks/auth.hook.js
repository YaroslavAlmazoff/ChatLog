import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import api from "../auth/api/auth";

const storageName = "user";

export const useAuth = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [activated, setActivated] = useState(false);
  const [onCourse, setOnCourse] = useState(false);

  const loggedOut = () => !localStorage.getItem(storageName);

  const login = useCallback((_token, _id, _onCourse) => {
    setToken(_token);
    setUserId(_id);
    setAuthenticated(true);
    setActivated(true);
    setOnCourse(_onCourse);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: _id,
        token: _token,
      }),
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = JSON.parse(localStorage.getItem(storageName));
      const isPortfolio =
        window.location.pathname === "/portfolio/" ||
        window.location.pathname === "/portfolio";
      if (data) {
        const response = await api.get("/api/refresh", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        console.log(response);

        if (isPortfolio) return;
        if (response.data.greeting) return navigate("/greeting");
        if (!response.data.verified) return navigate("/login");
        if (!response.data.activated) return navigate("/notactivated");
        login(
          response.data.token,
          response.data.userId,
          response.data.onCourse,
        );
      } else if (
        window.location.pathname === "/greeting" ||
        window.location.pathname === "/support" ||
        window.location.pathname === "/portfolio/" ||
        window.location.pathname === "/portfolio" ||
        window.location.pathname.includes("store")
      ) {
        return;
      } else {
        window.location = "/greeting";
      }
    };

    try {
      getData();
    } catch {
      navigate("/login");
    }

    const expirationTime = 1000 * 60 * 10;

    const intervalId = setInterval(
      () => {
        const now = new Date().getTime();
        const timeRemaining = expirationTime - now;
        if (timeRemaining < 30 * 60 * 1000) {
          getData();
        }
      },
      30 * 60 * 1000,
    );

    return () => clearInterval(intervalId);
  }, [login]);

  return {
    login,
    logout,
    loggedOut,
    token,
    userId,
    authenticated,
    activated,
    onCourse,
  };
};
