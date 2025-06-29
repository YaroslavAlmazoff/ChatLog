const PortfolioSite = ({ site }) => {
  return (
    <div>
      <img
        src={process.env.REACT_APP_API_URL + `/portfolio/${site.image}`}
        description="Screenshot"
      />
      <p>{site.title}</p>
      <a href={site.download}>{site.title}</a>
    </div>
  );
};

export default PortfolioSite;
