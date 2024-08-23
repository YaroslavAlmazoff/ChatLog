import "../../../styles/RoomPreviewTimes.css";

export default function RoomPreviewTimes({ item, onClick, className }) {
  return (
    <span onClick={() => onClick(item)} className={`times ${className}`}>
      &times;
    </span>
  );
}