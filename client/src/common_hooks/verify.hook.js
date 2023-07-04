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

      console.log(response);

      login(response.data.token, response.data.userId);

      return {
        isVerified: response.data.verified,
        isActivated: response.data.isActivated,
      };
    } catch (e) {
      console.log(e);
      window.location = "/login";
    }
  };
  return { verify };
};

export default useVerify;
