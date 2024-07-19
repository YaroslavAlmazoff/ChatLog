import Links from "./components/Links";
import Head from "./components/Head";
import Search from "./components/Search";
import Forecast from "./components/Forecast";
import News from "./components/News";
import "./homepage.css";
import { useEffect } from "react";
import useVerify from "../common_hooks/verify.hook";

const HomePage = () => {
  const { verify } = useVerify();

  useEffect(() => {
    verify();
  }, []);

  return (
    <div className="homepage">
      <Links />
      <div className="body">
        <Head />
        <Search />
        <Forecast />
        <News />
      </div>
    </div>
  );
};

export default HomePage;
