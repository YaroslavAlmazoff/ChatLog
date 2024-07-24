import { useNavigate } from "react-router";
import api from "../auth/api/auth";

const useRedirect = (setAuth) => {
  const navigate = useNavigate();

  const redirect = async () => {
    if (JSON.parse(localStorage.getItem("user"))) {
      try {
        const response = await api.get("/api/refresh", {
          headers: {
            Authorization: `Bearer ${
              JSON.parse(localStorage.getItem("user")).token
            }`,
          },
        });

        const { isVerified, isActivated, greeting, token, userId } =
          response.data;

        console.log(response);

        if (!isVerified) {
          if (!greeting) {
            navigate("/login");
          } else {
            navigate("/greeting");
          }
        } else {
          if (isActivated) {
            setAuth({ token, userId, isAuthenticated: isVerified });
            navigate(window.location.pathname);
          } else {
            navigate("/notactivated");
          }
        }
      } catch (e) {
        console.log(e);
        navigate("/login");
      }
    } else {
      navigate("/greeting");
    }
  };

  return redirect;
};

export default useRedirect;
