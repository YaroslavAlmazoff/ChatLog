import PortfolioApp from "./PortfolioApp";
import PortfolioSite from "./PortfolioSite";
import "./Portfolio.css";

const Portfolio = () => {
  const projects = {
    sites: [
      {
        title: "Социальная сеть ChatLog",
        link: "https://chatlog.ru/greeting",
        image: "chatlog.jpg",
      },
      {
        title: "Сайт Космотория (старый)",
        link: "https://cosmotoryia.ru",
        image: "cosmotoryia.jpg",
      },
      {
        title: "Сайт Космотория (новый)",
        link: "https://cosmotoriya.ru",
        image: "cosmotoriya.jpg",
      },
      {
        title: "Сайт-галерея для продажи картин",
        link: "https://kiosk-art.ru",
        image: "kiosk-art.jpg",
      },
    ],
    apps: [
      {
        title: "Chatlog Astro",
        description:
          "Мое первое приложение Android. Создавалось на языке Kotlin при помощи Android Studio.",
        link: "https://www.rustore.ru/catalog/app/com.chatlog.aep",
        download: "chatlog-astro.apk",
        image: "chatlog-astro.jpg",
        logo: "chatlog-astro.png",
      },
      {
        title: "MediaPlayer",
        description: `Приложение для прослушивания скачанной музыки. 
          Создавался по принципам Clean Architecture с паттерном MVVM в программе Android Studio. 
          Использовались такие технологии, как: Kotlin, Jetpack 
          Compose, Hilt, Kotlin Coroutines & Flow, Room, ExoPlayer.`,
        download: "media-player.apk",
        image: "media-player.jpg",
        logo: "media-player.png",
      },
      {
        title: "Reminder",
        description: `Приложение для создания напоминаний. 
        В указанные дату и время приложение отправляет уведомление с напоминанием. 
        Создавалось с использованием Kotlin и Jetpack Compose в Android Studio.`,
        download: "reminder.apk",
        image: "reminder.jpg",
        logo: "reminder.png",
      },
      {
        title: "Фонарик",
        description: `В приложении реализован полезный расширенный функционал обычного фонарика: сигнал SOS и режим с регулируемой частотой вспышек. 
        Само приложение выполнено с необычным дизайном. Создавалось на Kotlin в Android Studio.`,
        download: "flashlight.apk",
        image: "flashlight.jpg",
        logo: "flashlight.png",
      },
      {
        title: "Orbital Havoc",
        description:
          "Моя первая и единственная игра, созданная с помощью движка Unity. Цель игры проста: как можно дольше продержаться на орбите Земли, уничтожая астероиды.",
        download: "orbital-havoc.apk",
        image: "orbital-havoc.jpg",
        logo: "orbital-havoc.png",
      },
    ],
  };

  return (
    <div className="portfolio block">
      <p className="portfolio-main-title">
        📔 Портфолио Кижаева Ярослава Романовича (Yaroslav Almazoff - это мой
        псевдоним)
      </p>
      <hr />
      <p>
        Мой Github:&nbsp;
        <a
          className="portfolio-link"
          href="https://github.com/YaroslavAlmazoff"
          target="_blank"
        >
          https://github.com/YaroslavAlmazoff
        </a>
      </p>
      <p>
        Мой YouTube-канал:&nbsp;
        <a
          className="portfolio-link"
          href="https://www.youtube.com/@yaroslavalmazoff"
          target="_blank"
        >
          https://www.youtube.com/@yaroslavalmazoff
        </a>
      </p>
      <p>
        Если не работает YouTube, я есть на Rutube:&nbsp;
        <a
          className="portfolio-link"
          href="https://rutube.ru/channel/34271160/"
          target="_blank"
        >
          https://rutube.ru/channel/34271160/
        </a>
      </p>
      <p>
        <span>Коротко обо мне:&nbsp;</span>
        Разработчик-энтузиаст, серьезно увлекаюсь программированием на JS и
        Kotlin. Мой первый сайт попал в Интернет в далеком 2017 году. В прошлом
        году на него заходило несколько сотен человек в день согласно метрике. В
        2023 году открыл свой YouTube-канал на тему программирования. Хочу
        погрузиться в тему искусственного интеллекта и развиваться в этой сфере.
      </p>
      <p className="portfolio-projects-title">Мои проекты 💻</p>
      <p className="portfolio-title">Сайты</p>
      <div className="portfolio-projects-list">
        {projects.sites.map((site) => (
          <PortfolioSite site={site} />
        ))}
      </div>
      <p className="portfolio-title">Android-приложения и игры</p>
      <div className="portfolio-projects-list">
        {projects.apps.map((app) => (
          <PortfolioApp app={app} />
        ))}
      </div>
      <br />
      <br />
    </div>
  );
};

export default Portfolio;
