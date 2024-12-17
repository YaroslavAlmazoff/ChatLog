import useWord from "../../../common_hooks/divideWord.hook";
import useHighlight from "../../../common_hooks/highlight.hook";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import "../../styles/RoomItem.css";

export default function ChatRoomItem({ room }) {
  const auth = useContext(AuthContext);
  const { divideWord } = useWord();
  const { randomColor, randomShadow, randomBlockShadow } = useHighlight();

  const goToRoom = () => {
    window.location = room.isChat
      ? `/chat/${room._id}`
      : `/messages/${room._id}`;
  };

  return (
    <div
      onClick={goToRoom}
      className={
        room.unread && room.sender != auth.userId
          ? "room-item move-glow-block"
          : `room-item ${randomColor()} ${randomBlockShadow()}`
      }
    >
      <div className="room-item-info-wrapper">
        <img
          className={`room-img ${randomBlockShadow()}`}
          width="60"
          src={
            room.avatarUrl
              ? process.env.REACT_APP_API_URL +
                `/${room.isChat ? "chat" : "user"}avatars/` +
                room.avatarUrl
              : require("../../../auth/img/group.png")
          }
          alt="user"
        />
        <div className="room-item-info">
          <p className={`room-title ${randomColor()} ${randomShadow()}`}>
            {room.isChat ? room.title : `${room.name} ${room.surname}`}
          </p>
          <p className="room-last-message ml">
            {divideWord(room.lastMessage, 40)}
          </p>
        </div>
      </div>
    </div>
  );
}
