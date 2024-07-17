import "../../styles/RoomHead.css";

export default function RoomHead({ name, onlineDate, isOnline }) {
  return (
    <div className="room-head">
      <span className="room-head-text">
        {name}, {isOnline ? "Online" : `В сети ${onlineDate}`}
      </span>
    </div>
  );
}
