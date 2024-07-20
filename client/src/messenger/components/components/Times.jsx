import "../../styles/Times.css";

export default function Times({ item, onClick, ...props }) {
  return (
    <span onClick={() => onClick(item)} {...props}>
      &times;
    </span>
  );
}
