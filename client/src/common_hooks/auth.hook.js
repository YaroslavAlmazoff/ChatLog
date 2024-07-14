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

  const login = useCallback((token, id) => {
    setToken(token);
    setUserId(id);
    setAuthenticated(true);
    setActivated(true);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: token,
      })
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

      const { verified, activated, greeting, token, userId } = response.data;

      if (greeting) return navigate("/greeting");
      if (!verified) return navigate("/login");
      if (!activated) return navigate("/notactivated");

      login(token, userId);
      //navigate(window.location.pathname);
    };

    try {
      getData();
    } catch {
      navigate("/login");
    }
  }, [login]);

  return { login, logout, token, userId, authenticated, activated };
};
