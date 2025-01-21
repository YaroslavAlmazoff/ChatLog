import { useEffect } from "react";
import "./styles/hint.css";

const modalTypes = {
  neutral: "neutral",
  success: "success",
  error: "error",
};

const Hint = ({
  show = false,
  setShow = () => {},
  text = "",
  type = modalTypes.neutral,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShow(false);
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  if (!show) return null;

  return (
    <div className={`common-hint common-hint-${type} block-${type}`}>
      <span>{text}</span>
    </div>
  );
};

export default Hint;
