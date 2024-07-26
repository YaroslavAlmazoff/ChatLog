import RoomMessage from "./RoomMessage";
import "../../styles/RoomMessage.css";

export default function RoomMessages({ messages }) {
  return (
    <div className="room-messages">
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </div>
  );
}
