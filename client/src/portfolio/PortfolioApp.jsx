import "./PortfolioApp.css";

const PortfolioApp = ({ app }) => {
  return (
    <div className="portfolio-app portfolio-app-width">
      <img
        className="portfolio-app-image"
        src={process.env.REACT_APP_API_URL + `/portfolio/${app.image}`}
        description="Screenshot"
      />
      <p className="portfolio-app-title">{app.title}</p>
      <a
        className="portfolio-link"
        href={process.env.REACT_APP_API_URL + `/portfolio/${app.download}`}
      >
        Скачать APK
      </a>
      <br />
      <p>{app.description}</p>
      <br />
    </div>
  );
};

export default PortfolioApp;
