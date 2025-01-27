import { useContext } from "react";
import usePhotos from "../hooks/usePhotos";
import { ProfileContext } from "../context/ProfileContext";

const PhotoItem = ({ photo }) => {
  const { deletePhoto } = usePhotos();
  const { setPhotos } = useContext(ProfileContext);
  const { isOwner } = useContext(ProfileContext);
  return (
    <div className="foto-div">
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + photo.imageUrl}
      />
      {isOwner && (
        <span
          className="delete-foto"
          onClick={() => deletePhoto(photo.imageUrl, setPhotos)}
        >
          Удалить
        </span>
      )}
    </div>
  );
};

export default PhotoItem;
