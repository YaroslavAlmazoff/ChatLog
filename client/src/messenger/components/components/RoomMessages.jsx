import RoomMessage from "./RoomMessage";

export default function RoomMessages({ messages }) {
  return (
    <div className="room-messages">
      {messages.map((message) => (
        <RoomMessage message={message} />
      ))}
    </div>
  );
}
