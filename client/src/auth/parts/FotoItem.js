const FotoItem = ({ item }) => {
  return (
    <div>
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + item.imageUrl}
      />
    </div>
  );
};

export default FotoItem;
