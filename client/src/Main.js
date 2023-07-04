import React, { useEffect } from "react";
import api from "./auth/api/auth";
import useVerify from "./common_hooks/verify.hook";

const Main = () => {
  useEffect(() => {
    const navigate = async () => {
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
    };
    navigate();
  }, []);
  return <div></div>;
};

export default Main;
