import "../../styles/RoomHead.css";

export default function GroupRoomHead({ title }) {
  return (
    <div className="room-head">
      <span className="room-head-text">{title}</span>
    </div>
  );
}
