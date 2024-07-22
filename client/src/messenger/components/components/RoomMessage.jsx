import useFile from "../../hooks/useFile";
import RoomMessageActions from "./RoomMessageActions";
import RoomMessageImages from "./RoomMessageImages";
import RoomMessageVideos from "./RoomMessageVideos";

export default function RoomMessage({ message }) {
  const { fileFromServer } = useFile();

  return (
    <>
      <div className="room-message">
        <img
          src={fileFromServer("useravatars", message.avatar)}
          alt="Avatar"
          className="room-message-avatar"
        />
        <span className="room-message-text">{message.message}</span>
        <RoomMessageImages images={message.images} />
        <RoomMessageVideos videos={message.videos} />
      </div>
      <RoomMessageActions message={message} />
    </>
  );
}
