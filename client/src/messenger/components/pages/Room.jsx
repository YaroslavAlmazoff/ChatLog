import "../../styles/Room.css";
import RoomHead from "../components/RoomHead";

export default function Room() {
  return (
    <div className="room room-size">
      <RoomHead
        name="Yaroslav Almazoff"
        onlineDate="16.07.2024 18:00"
        isOnline={false}
      />
    </div>
  );
}
