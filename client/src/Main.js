import React, { useEffect } from "react";
import api from "./auth/api/auth";

const Main = () => {
  useEffect(() => {
    const navigate = async () => {
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
        } catch (e) {
          console.log(e);
          window.location = "/login";
        }
      } else {
        window.location = "/greeting";
      }
    };
    navigate();
  }, []);
  return <div></div>;
};

export default Main;
