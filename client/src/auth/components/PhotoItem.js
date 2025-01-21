const PhotoItem = ({ item, deletePhoto, isOwner }) => {
  return (
    <div className="foto-div">
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + item.imageUrl}
      />
      {isOwner && (
        <span
          className="delete-foto"
          onClick={() => deletePhoto(item.imageUrl)}
        >
          Удалить
        </span>
      )}
    </div>
  );
};

export default PhotoItem;
