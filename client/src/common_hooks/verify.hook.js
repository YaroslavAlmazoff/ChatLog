import { useContext } from "react";
import api from "../auth/api/auth";
import { useAuth } from "./auth.hook";
import { AuthContext } from "../context/AuthContext";

const useVerify = () => {
  const { login } = useAuth();
  const { token } = useContext(AuthContext);
  const verify = async () => {
    if (JSON.parse(localStorage.getItem("user"))) {
      try {
        const response = await api.get("/api/refresh", {
          headers: {
            Authorization: `Bearer ${token}`,
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
    }
  };
  return { verify };
};

export default useVerify;
