import Modal from "./Modal";
import { useModalContext } from "../../context/ModalContext";

const ModalWrapper = () => {
  const { isVisible, closeModal, modalContent } = useModalContext();

  return (
    <Modal show={isVisible} onClose={closeModal}>
      {modalContent}
    </Modal>
  );
};

export default ModalWrapper;
