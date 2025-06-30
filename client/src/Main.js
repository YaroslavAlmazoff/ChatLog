import { useContext, useEffect } from "react";
import { AuthContext } from "./context/AuthContext";

const Main = () => {
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      window.location = "/home";
    } else {
      console.log(window.location.pathname);
      if (
        window.location.pathname !== "/portfolio" &&
        window.location.pathname !== "/portfolio/"
      ) {
        window.location = "/greeting";
      }
    }
  }, [authenticated]);
  return <div></div>;
};

export default Main;
