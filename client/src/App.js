import "./App.css";
import "./common.css";
import { useRoutes } from "./routes";
import Header from "./common_components/Header";
import React, { useEffect, useState } from "react";
import { useAuth } from "./common_hooks/auth.hook";
import useRedirect from "./common_hooks/redirect.hook";
import { AuthContext } from "./context/AuthContext";
import api from "./auth/api/auth";
import useDate from "./common_hooks/date.hook";
import useVerify from "./common_hooks/verify.hook";
import "./common_components/modal-window/modal-window.css";

function App() {
  const { verify } = useVerify();
  const { getCurrentDate } = useDate();
  const redirect = useRedirect();
  const routes = useRoutes();

  const [auth, setAuth] = useState({
    token: null,
    userId: null,
    isAuthenticated: false,
  });

  const [isVerified, setIsVerified] = useState(false);
  const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    // const setVisit = async () => {
    //   const verifiedData = await verify();
    //   setIsVerified(verifiedData.isVerified);
    //   setIsActivated(verifiedData.isActivated);
    //   await api.get("/api/admin/setvisit");
    // };

    // const lastVisit = async () => {
    //   const date = getCurrentDate();
    //   if (localStorage.getItem("user")) {
    //     await api.post(
    //       "/api/lastvisit",
    //       { date },
    //       {
    //         headers: {
    //           Authorization: `Bearer ${
    //             JSON.parse(localStorage.getItem("user")).token
    //           }`,
    //         },
    //       }
    //     );
    //   }
    // };

    // setVisit();
    // lastVisit();
    redirect(setAuth);
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <div className="App">
        <Header isVerified={isVerified} isActivated={isActivated} />
        {routes}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

//Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
