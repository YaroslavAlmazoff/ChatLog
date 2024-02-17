import { AuthContext } from "../../context/AuthContext";
import ModalWindow from "../../common_components/modal-window/ModalWindow";
import { useState, useContext } from "react";

const FotoItem = ({ item, deleteFoto, isOwner }) => {
  const auth = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const openWindow = () => {
    setModal(true);
    auth.darkScreen(true);
  };
  const closeWindow = () => {
    setModal(false);
    auth.darkScreen(false);
  };
  const onConfirm = () => {
    deleteFoto(item.imageUrl);
  };
  return (
    <div className="foto-div">
      {modal && (
        <ModalWindow
          isOpen={modal}
          onClose={closeWindow}
          onConfirm={onConfirm}
          text="Вы действительно хотите удалить эту фотографию?"
        />
      )}
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + item.imageUrl}
      />
      {isOwner && (
        <span className="delete-foto" onClick={openWindow}>
          Удалить
        </span>
      )}
    </div>
  );
};

export default FotoItem;
