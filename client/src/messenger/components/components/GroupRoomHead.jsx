import { folders } from "../../data/messengerConfiguration";
import useFile from "../../hooks/useFile";
import "../../styles/RoomHead.css";
import pointsIcon from "../../img/points.png";
import { useEffect } from "react";
import { useParams } from "react-router";
import useGroupAPI from "../../hooks/useGroupAPI";

export default function GroupRoomHead({ groupTitle, avatarUrl }) {
  const { fileFromServer } = useFile();
  const { changeTitle } = useGroupAPI();
  const { id } = useParams();
  const inputRef = useRef(null);
  const [title, setTitle] = useState();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(groupTitle);
  }, [groupTitle]);

  const startEditing = () => {
    setEditing(true);
    inputRef.current.value = title;
    inputRef.current.focus();
  };

  const changeGroupTitle = async (e) => {
    if (e.key === "Enter") {
      await changeTitle(title, id);
      setEditing(false);
    }
  };

  return (
    <div className="room-head room-group-head">
      <img
        className="room-group-head-avatar"
        src={fileFromServer(folders.groupAvatars, avatarUrl)}
        alt="Avatar"
      />
      {editing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input room-group-head-field"
          placeholder="Нажмите Enter чтобы сохранить"
          onKeyDown={changeGroupTitle}
        />
      ) : (
        <span onClick={startEditing} className="room-head-text">
          {title}
        </span>
      )}
      <img
        className="room-group-head-open-info"
        src={pointsIcon}
        alt="Group Info"
      />
    </div>
  );
}
