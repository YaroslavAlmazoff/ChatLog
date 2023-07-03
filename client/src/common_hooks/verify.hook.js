import api from "../auth/api/auth";
import { useAuth } from "./auth.hook";

const useVerify = () => {
  const { login, logout } = useAuth();
  const verify = async () => {
    try {
      const response = await api.get("/api/refresh", {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("user")).token
          }`,
        },
      });

      if (!response.data.verified) {
        window.location = "/login";
      }
      login(response.data.token, response.data.userId);
      return {
        token: response.data.token,
        userId: response.data.userId,
        login,
        logout,
        isAuthenticated: response.data.verified,
      };
    } catch (e) {
      console.log(e);
      window.location = "/login";
    }
  };
  return { verify };
};

export default useVerify;
