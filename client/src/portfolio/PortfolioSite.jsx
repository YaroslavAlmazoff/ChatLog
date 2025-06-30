import "./PortfolioSite.css";

const PortfolioSite = ({ site }) => {
  return (
    <div className="portfolio-site portfolio-site-width">
      <img
        className="portfolio-site-image"
        src={process.env.REACT_APP_API_URL + `/portfolio/${site.image}`}
        description="Screenshot"
      />
      <p>{site.title}</p>
      <a className="portfolio-link" href={site.link} target="_blank">
        {site.link}
      </a>
    </div>
  );
};

export default PortfolioSite;
