import { folders } from "../../data/messengerConfiguration";
import useFile from "../../hooks/useFile";
import "../../styles/RoomHead.css";
import pointsIcon from "../../img/points.png";

export default function GroupRoomHead({ title, avatarUrl }) {
  const { fileFromServer } = useFile();
  return (
    <div className="room-head room-group-head">
      <img
        className="room-group-head-avatar"
        src={fileFromServer(folders.groupAvatars, avatarUrl)}
        alt="Avatar"
      />
      <span className="room-head-text">{title}</span>
      <img
        className="room-group-head-open-info"
        src={pointsIcon}
        alt="Group Info"
      />
    </div>
  );
}
