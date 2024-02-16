import { AuthContext } from "../../context/AuthContext";
import ModalWindow from "../../common_components/modal-window/ModalWindow";
import { useContext } from "react";

const FotoItem = ({ item, deleteFoto }) => {
  const auth = useContext(AuthContext);
  const onConfirm = () => {
    deleteFoto(item.url);
  };
  return (
    <div>
      <ModalWindow
        isOpen={auth.isOpen}
        onClose={auth.closeWindow}
        onConfirm={onConfirm}
        text="Вы действительно хотите удалить эту фотографию?"
      />
      <img
        className="user-foto-preview block"
        alt=""
        src={process.env.REACT_APP_API_URL + "/userfotos/" + item.imageUrl}
      />
      <span className="delete-foto" onClick={auth.openWindow}>
        Удалить
      </span>
    </div>
  );
};

export default FotoItem;
