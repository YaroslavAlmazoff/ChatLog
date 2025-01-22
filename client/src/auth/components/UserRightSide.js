import { useContext, useState } from "react";
import useRandom from "../../common_hooks/random.hook";
import "../styles/user.css";
import PhotoItem from "./PhotoItem";
import usePhotos from "../hooks/usePhotos";
import { ProfileContext } from "../context/ProfileContext";

const UserRightSide = () => {
  const { randomKey } = useRandom();
  const { photos } = useContext(ProfileContext);

  return (
    <div className="user-right-side">
      <div className="user-fotos">
        <p className="user-fotos-title">Фотографии {photos.length}</p>
        {photos.map((el) => (
          <PhotoItem key={randomKey()} photo={el} />
        ))}
      </div>
    </div>
  );
};

export default UserRightSide;
