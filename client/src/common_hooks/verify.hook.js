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

      if (!response.data.verified) {
        if (localStorage.getItem("registered")) {
          window.location = "/login";
        } else {
          window.location = "/greeting";
        }
      } else {
        if (response.data.isActivated) {
          window.location = "/home";
        } else {
          window.location = "/notactivated";
        }
      }

      login(response.data.token, response.data.userId);
    } catch (e) {
      console.log(e);
      window.location = "/login";
    }
  };
  return { verify };
};

export default useVerify;
