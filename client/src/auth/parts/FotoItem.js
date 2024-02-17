import { AuthContext } from "../../context/AuthContext";
import ModalWindow from "../../common_components/modal-window/ModalWindow";
import { useState } from "react";

const FotoItem = ({ item, deleteFoto }) => {
  const [modal, setModal] = useState(false);
  const onConfirm = () => {
    deleteFoto(item.url);
  };
  const openWindow = () => {
    setModal(true);
  };
  const closeWindow = () => {
    setModal(false);
  };
  return (
    <div>
      <ModalWindow
        isOpen={modal}
        onClose={closeWindow}
        onConfirm={onConfirm}
        text="Вы действительно хотите удалить эту фотографию?"
      />
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + item.imageUrl}
      />
      <span className="delete-foto" onClick={openWindow}>
        Удалить
      </span>
    </div>
  );
};

export default FotoItem;
