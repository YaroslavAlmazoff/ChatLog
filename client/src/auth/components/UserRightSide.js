import { useState } from "react";
import useRandom from "../../common_hooks/random.hook";
import "../styles/user.css";
import PhotoItem from "./PhotoItem";
import usePhotos from "../hooks/usePhotos";

const UserRightSide = ({ photos, isOwner }) => {
  const { randomKey } = useRandom();
  const { deletePhoto } = usePhotos();

  return (
    <div className="user-right-side">
      <div className="user-fotos">
        <p className="user-fotos-title">Фотографии {photos.length}</p>
        {photos.map((el) => (
          <PhotoItem
            key={randomKey()}
            item={el}
            deletePhoto={deletePhoto}
            isOwner={isOwner}
          />
        ))}
      </div>
    </div>
  );
};

export default UserRightSide;
