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
import Loader from "./common_components/Loader";

function App() {
  // const { verify } = useVerify();
  // const { getCurrentDate } = useDate();
  const routes = useRoutes();

  const { login, logout, token, userId, authenticated, activated } = useAuth();

  // const [isVerified, setIsVerified] = useState(false);
  // const [isActivated, setIsActivated] = useState(false);

  useEffect(() => {
    console.log("start");
  }, [token]);

  return (
    <>
      {token && userId ? (
        <AuthContext.Provider
          value={{ login, logout, token, userId, authenticated, activated }}
        >
          <div className="App">
            <Header />
            {routes}
          </div>
        </AuthContext.Provider>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default App;

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
