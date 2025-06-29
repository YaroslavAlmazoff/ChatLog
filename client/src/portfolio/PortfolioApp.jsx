import "./PortfolioApp.css";

const PortfolioApp = ({ app }) => {
  return (
    <div>
      <img
        src={process.env.REACT_APP_API_URL + `/portfolio/${app.image}`}
        description="Screenshot"
      />
      <p>{app.title}</p>
      <a href={process.env.REACT_APP_API_URL + `/portfolio/${app.download}`}>
        Скачать APK
      </a>
    </div>
  );
};

export default PortfolioApp;
