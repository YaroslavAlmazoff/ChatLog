import "./CommonModal.css";

const modalTypes = {
  neutral: "neutral",
  success: "success",
  error: "error",
  image: "image",
  video: "video",
};

const CommonModal = ({
  show = false,
  onClose = () => {},
  children = <div></div>,
  type = modalTypes.neutral,
  padding = "20px",
}) => {
  if (!show) return null;

  return (
    <div className="common-modal" onClick={onClose}>
      <span className="common-modal-close" onClick={onClose}>
        &times;
      </span>
      <div
        className={`common-modal-content common-modal-content-width common-modal-${type} block-${type}`}
        style={{ padding }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="common-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default CommonModal;
