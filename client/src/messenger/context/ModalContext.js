import React, { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const useModalContext = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const openModal = (content) => {
    setModalContent(content);
    setIsVisible(true);
  };

  const closeModal = () => {
    setIsVisible(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider
      value={{ isVisible, modalContent, openModal, closeModal }}
    >
      {children}
    </ModalContext.Provider>
  );
};
