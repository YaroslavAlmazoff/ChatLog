import { useState, useCallback, useEffect } from "react";

const storageName = "user";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [userId, setUserId] = useState(null);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
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
      const response = await api.get("/api/refresh", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
      setToken(response.data.token);
      setUserId(response.data.userId);
      if (response.data && response.data.token) {
        login(response.data.token, response.data.userId);
      }
    };
    getData();
  }, [login]);

  return { login, logout, token, userId };
};
