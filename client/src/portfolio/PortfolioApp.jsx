import "./PortfolioApp.css";

const PortfolioApp = ({ app }) => {
  return (
    <div className="portfolio-app">
      <img
        className="portfolio-app-image"
        style={
          app.download == "orbital-havoc.apk"
            ? { transform: "rotate(90deg)" }
            : { transform: "rotate(0deg)" }
        }
        src={process.env.REACT_APP_API_URL + `/portfolio/${app.image}`}
        description="Screenshot"
      />
      <p>{app.title}</p>
      <a
        className="portfolio-link"
        href={process.env.REACT_APP_API_URL + `/portfolio/${app.download}`}
      >
        Скачать APK
      </a>
      <br />
    </div>
  );
};

export default PortfolioApp;
