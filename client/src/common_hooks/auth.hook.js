import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import api from "../auth/api/auth";

const storageName = "user";

export const useAuth = () => {
  const navigate = useNavigate();
  // const [token, setToken] = useState(null);
  // const [userId, setUserId] = useState(null);
  // const [authenticated, setAuthenticated] = useState(false);
  // const [activated, setActivated] = useState(false);
  const token = useRef(null);
  const userId = useRef(null);
  const authenticated = useRef(null);
  const activated = useRef(null);

  const login = useCallback((token, id) => {
    // setToken(token);
    // setUserId(id);
    // setAuthenticated(true);
    // setActivated(true);
    token.current = token;
    userId.current = id;
    authenticated.current = true;
    activated.current = true;
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    token.current = null;
    userId.current = null;
    authenticated.current = false;
    activated.current = false;
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const getData = async () => {
      const data = JSON.parse(localStorage.getItem(storageName));
      if (
        !data &&
        window.location.pathname !== "/greeting" &&
        window.location.pathname !== "/support"
      )
        return navigate("/greeting");

      const response = await api.get("/api/refresh", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      console.log(response);

      const { verified, activated, greeting, token, userId } = response.data;

      if (greeting) return navigate("/greeting");
      if (!verified) return navigate("/login");
      if (!activated) return navigate("/notactivated");

      login(token, userId);
    };

    try {
      getData();
    } catch {
      navigate("/login");
    }

    const expirationTime = 1000 * 60 * 10;

    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const timeRemaining = expirationTime - now;
      if (timeRemaining < 30 * 60 * 1000) {
        getData();
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [login]);

  return {
    login,
    logout,
    token: token.current,
    userId: userId.current,
    authenticated: authenticated.current,
    activated: activated.current,
  };
};
