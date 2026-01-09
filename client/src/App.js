import "./App.css";
import "./common.css";
import { useRoutes } from "./routes";
import Header from "./common_components/Header";
import { useAuth } from "./common_hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import "./common_components/modal-window/modal-window.css";
import Loader from "./common_components/Loader";

function App() {
  const routes = useRoutes();

  const {
    login,
    logout,
    loggedOut,
    token,
    userId,
    authenticated,
    activated,
    onCourse,
  } = useAuth();

  return (
    <>
      {(token && userId) ||
      window.location.pathname === "/" ||
      window.location.pathname === "/greeting" ||
      window.location.pathname === "/login" ||
      window.location.pathname === "/register" ||
      window.location.pathname === "/support" ||
      window.location.pathname === "/portfolio/" ||
      window.location.pathname === "/portfolio" ? (
        <AuthContext.Provider
          value={{
            login,
            logout,
            token,
            userId,
            authenticated,
            activated,
            onCourse,
          }}
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
