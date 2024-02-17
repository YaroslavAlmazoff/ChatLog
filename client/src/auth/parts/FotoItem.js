const FotoItem = ({ item, deleteFoto, isOwner }) => {
  return (
    <div className="foto-div">
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + item.imageUrl}
      />
      {isOwner && (
        <span className="delete-foto" onClick={() => deleteFoto(item.imageUrl)}>
          Удалить
        </span>
      )}
    </div>
  );
};

export default FotoItem;
