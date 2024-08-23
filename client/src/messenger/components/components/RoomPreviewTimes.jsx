import "../../styles/Times.css";

export default function Times({ item, onClick, className }) {
  return (
    <span onClick={() => onClick(item)} className={`times ${className}`}>
      &times;
    </span>
  );
}
