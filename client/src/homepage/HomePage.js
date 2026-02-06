import HomePageNavigation from "./components/HomePageNavigation";
import Head from "./components/Head";
import Search from "./components/Search";
import Forecast from "./components/Forecast";
import News from "./components/News";
import "./homepage.css";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import MiniProfile from "../course/MiniProfile";
import Content from "../course/content/Content";

const HomePage = () => {
  const { onCourse } = useContext(AuthContext);
  const [activeLesson, setActiveLesson] = useState(null);

  return (
    <div className="homepage">
      <HomePageNavigation
        activeLesson={activeLesson}
        onSelectLesson={setActiveLesson}
      />
      <div className="body">
        <Head />
        {onCourse ? (
          <>
            <MiniProfile />
            <Content lesson={activeLesson} />
          </>
        ) : (
          <>
            <Search />
            <Forecast />
            <News />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
