import React, { useEffect } from "react";
import api from "./auth/api/auth";
import useVerify from "./common_hooks/verify.hook";

const Main = () => {
  const { verify } = useVerify();
  useEffect(() => {
    const navigate = async () => {
      const { verified, isActivated } = await verify();

      if (!verified) {
        if (localStorage.getItem("registered")) {
          window.location = "/login";
        } else {
          window.location = "/greeting";
        }
      } else {
        if (isActivated) {
          window.location = "/home";
        } else {
          window.location = "/notactivated";
        }
      }
      navigate();
    };
  }, []);
  return <div></div>;
};

export default Main;
