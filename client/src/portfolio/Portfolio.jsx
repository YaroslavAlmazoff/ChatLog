import PortfolioApp from "./PortfolioApp";
import PortfolioSite from "./PortfolioSite";
import "./Portfolio.css";

const Portfolio = () => {
  const projects = {
    sites: [
      {
        title: "Социальная сеть ChatLog",
        link: "https://chatlog.ru",
        image: "",
      },
      {
        title: "Сайт про космос Космотория (старый)",
        link: "https://cosmotoryia.ru",
        image: "",
      },
      {
        title: "Сайт про космос Космотория (новый)",
        link: "https://cosmotoriya.ru",
        image: "",
      },
      {
        title: "Сайт-галерея для продажи картин",
        link: "https://kiosk-art.ru",
        image: "",
      },
    ],
    apps: [
      {
        title: "Chatlog Astro",
        description:
          "Мое первое приложение Android. Создавалось на языке Kotlin при помощи Android Studio.",
        link: "https://www.rustore.ru/catalog/app/com.chatlog.aep",
        download: "https://chatlog.ru/portfolio/chatlog-astro.apk",
        image: "https://chatlog.ru/portfolio/chatlog-astro.jpg",
        logo: "https://chatlog.ru/portfolio/chatlog-astro.png",
      },
      {
        title: "MediaPlayer",
        description: `Приложение для прослушивания скачанной музыки. 
          Создавался по принципам Clean Architecture с паттерном MVVM в программе Android Studio. 
          Использовались такие технологии, как: Kotlin, Jetpack 
          Compose, Hilt, Kotlin Coroutines & Flow, Room, ExoPlayer.`,
        download: "https://chatlog.ru/portfolio/mediaplayer.apk",
        image: "https://chatlog.ru/portfolio/mediaplayer.jpg",
        logo: "https://chatlog.ru/portfolio/mediaplayer.png",
      },
      {
        title: "Reminder",
        description: `Приложение для создания напоминаний. 
        В указанные дату и время приложение отправляет уведомление с напоминанием. 
        Создавалось с использованием Kotlin и Jetpack Compose в Android Studio.`,
        download: "https://chatlog.ru/portfolio/reminder.apk",
        image: "https://chatlog.ru/portfolio/reminder.jpg",
        logo: "https://chatlog.ru/portfolio/reminder.png",
      },
      {
        title: "Диктофон",
        description: `Простое приложение для записи голосовых сообщений. Создавалось на Kotlin в Android Studio.`,
        download: "https://chatlog.ru/portfolio/voice-recorder.apk",
        image: "https://chatlog.ru/portfolio/voice-recorder.jpg",
        logo: "https://chatlog.ru/portfolio/voice-recorder.png",
      },
      {
        title: "Фонарик",
        description: `В приложении реализован полезный расширенный функционал обычного фонарика: сигнал SOS и режим с регулируемой частотой вспышек. 
        Само приложение выполнено с необычным дизайном. Создавалось на Kotlin в Android Studio.`,
        download: "https://chatlog.ru/portfolio/flashlight.apk",
        image: "https://chatlog.ru/portfolio/flashlight.jpg",
        logo: "https://chatlog.ru/portfolio/flashlight.png",
      },
      {
        title: "Orbital Havoc",
        description:
          "Моя первая и единственная игра, созданная с помощью движка Unity. Цель игры проста: как можно дольше продержаться на орбите Земли, уничтожая астероиды.",
        download: "https://chatlog.ru/portfolio/orbital-havoc.apk",
        image: "https://chatlog.ru/portfolio/orbital-havoc.jpg",
        logo: "https://chatlog.ru/portfolio/orbital-havoc.png",
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
        >
          https://github.com/YaroslavAlmazoff
        </a>
      </p>
      <p>
        Мой YouTube-канал:&nbsp;
        <a
          className="portfolio-link"
          href="https://www.youtube.com/@yaroslavalmazoff"
        >
          https://www.youtube.com/@yaroslavalmazoff
        </a>
      </p>
      <p>
        Если не работает YouTube, я есть на Rutube:
        <a
          className="portfolio-link"
          href="https://rutube.ru/channel/34271160/"
        >
          https://rutube.ru/channel/34271160/
        </a>
      </p>
      <p className="portfolio-projects-title">Мои проекты 💻</p>
      <p className="portfolio-title">Сайты</p>
      <div className="portfolio-projects-list">
        {projects.sites.map((site) => (
          <PortfolioSite site={site} />
        ))}
      </div>
      <p className="portfolio-title">Android-приложения и игры</p>
      <p>
        ❕Чтобы посмотреть описание, щелкните по иконке или названию приложения.
      </p>
      <div className="portfolio-projects-list">
        {projects.apps.map((app) => (
          <PortfolioApp app={app} />
        ))}
      </div>
    </div>
  );
};

export default Portfolio;
