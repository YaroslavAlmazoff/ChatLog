import "../../styles/Room.css";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";

export default function Room() {
  return (
    <div className=" room-size room">
      <RoomHead
        name="Yaroslav Almazoff"
        onlineDate="16.07.2024 18:00"
        isOnline={false}
      />

      <RoomMessageField />
    </div>
  );
}
