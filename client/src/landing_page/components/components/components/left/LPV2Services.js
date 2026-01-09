import { useState } from "react";
import LPV2Service from "./components/LPV2Service";

const LPV2Services = () => {
  const [services] = useState([
    {
      title: "Курсы",
      img: require("../../../../img/courses.png"),
      color: "blue",
    },
    {
      title: "Приложения и игры",
      img: require("../../../../img/games.png"),
      color: "purple",
    },
    {
      title: "Новости",
      img: require("../../../../img/news.png"),
      color: "navy",
      status: "soon",
    },
    {
      title: "Файловое хранилище",
      img: require("../../../../img/cloud.png"),
      color: "green",
      status: "soon",
    },
    {
      title: "Удобный мессенджер",
      img: require("../../../../img/messenger.png"),
      color: "pink",
    },
    {
      title: "Реклама",
      status: "dev",
      img: require("../../../../img/services.png"),
      color: "orange",
    },
    {
      title: "Объявления",
      status: "dev",
      img: require("../../../../img/ass.png"),
      color: "blue",
    },
  ]);

  return (
    <div className="lpv2-services-wrapper">
      <div className="lpv2-services">
        {services.map((el) => (
          <LPV2Service el={el} />
        ))}
      </div>
    </div>
  );
};

export default LPV2Services;
