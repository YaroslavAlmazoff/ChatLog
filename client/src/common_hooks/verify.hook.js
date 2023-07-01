import api from "../auth/api/auth";
import { useAuth } from "./auth.hook";

const useVerify = () => {
  const { login } = useAuth();
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
        window.location = "/login";
      }
      console.log(response.data.token);
      login(response.data.token, response.data.userId);
    } catch (e) {
      console.log(e);
      window.location = "/login";
    }
  };
  return { verify };
};

export default useVerify;
