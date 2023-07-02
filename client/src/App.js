import "./App.css";
import "./common.css";
import { useRoutes } from "./routes";
import Header from "./common_components/Header";
import React, { useEffect, useState } from "react";
import { useAuth } from "./common_hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import api from "./auth/api/auth";
import useDate from "./common_hooks/date.hook";
import $ from "jquery";
import useVerify from "./common_hooks/verify.hook";
import auth from "./auth/api/auth";

function App() {
  const { verify } = useVerify();
  const [colors] = useState([
    [15, 15, 40],
    [0, 55, 66],
    [13, 43, 56],
    [0, 0, 0],
    [27, 40, 106],
    [39, 19, 23],
    [38, 38, 38],
    [38, 0, 33],
    [12, 1, 59],
    [0, 0, 0],
    [56, 44, 41],
    [0, 0, 0],
  ]);

  var step = 0;
  var colorIndices = [0, 1, 2, 3];
  var gradientSpeed = 0.002;

  const updateGradient = () => {
    if ($ === undefined) return;

    let c0_0 = colors[colorIndices[0]];
    let c0_1 = colors[colorIndices[1]];
    let c1_0 = colors[colorIndices[2]];
    let c1_1 = colors[colorIndices[3]];

    let istep = 1 - step;
    let r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
    let g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
    let b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
    let color1 = "rgb(" + r1 + "," + g1 + "," + b1 + ")";

    let r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
    let g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
    let b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
    let color2 = "rgb(" + r2 + "," + g2 + "," + b2 + ")";

    $("body")
      .css({
        background:
          "-webkit-gradient(linear, left top, right top, from(" +
          color1 +
          "), to(" +
          color2 +
          "))",
      })
      .css({
        background:
          "-moz-linear-gradient(left, " + color1 + " 0%, " + color2 + " 100%)",
      });

    step += gradientSpeed;
    if (step >= 1) {
      step %= 1;
      colorIndices[0] = colorIndices[1];
      colorIndices[2] = colorIndices[3];
      colorIndices[1] =
        (colorIndices[1] +
          Math.floor(1 + Math.random() * (colors.length - 1))) %
        colors.length;
      colorIndices[3] =
        (colorIndices[3] +
          Math.floor(1 + Math.random() * (colors.length - 1))) %
        colors.length;
    }
  };

  useEffect(() => {
    setInterval(updateGradient, 10);
  }, [colors]);

  const { token, login, logout, userId } = useAuth();

  const [verifyData, setVerifyData] = useState({
    token: JSON.parse(localStorage.getItem("user")).token,
    userId: JSON.parse(localStorage.getItem("user")).userId,
    login,
    logout,
    isAuthenticated: true,
  });

  const isAuthenticated = !!token;
  const [isVerified, setIsVerified] = useState(false);
  const routes = useRoutes(isVerified);
  const { getCurrentDate } = useDate();
  useEffect(() => {
    const setVisit = async () => {
      await api.get("/api/admin/setvisit");
    };
    setVisit();
    const lastVisit = async () => {
      const data = await verify();
      setVerifyData(data);
      setIsVerified(true);
      const date = getCurrentDate();
      if (localStorage.getItem("user")) {
        await api.post("/api/lastvisit", { date }, { headers: { token } });
      }
    };
    lastVisit();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: verifyData.token,
        login,
        logout,
        userId,
        isAuthenticated,
      }}
    >
      <div className="App">
        <Header isVerified={isVerified} />
        {routes}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

//Authorization: `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
