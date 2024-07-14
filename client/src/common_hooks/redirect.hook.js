import { useNavigate } from "react-router";
import api from "../auth/api/auth";

const useRedirect = () => {
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

        console.log(response);

        if (!response.data.verified) {
          if (localStorage.getItem("registered")) {
            navigate("/login");
          } else {
            navigate("/greeting");
          }
        } else {
          if (response.data.isActivated) {
            navigate("/home");
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
