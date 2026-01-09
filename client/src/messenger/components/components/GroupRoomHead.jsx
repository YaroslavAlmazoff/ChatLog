import { folders, roomContentTypes } from "../../data/messengerConfiguration";
import useFile from "../../hooks/useFile";
import "../../styles/RoomHead.css";
import pointsIcon from "../../img/points.png";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import useGroupAPI from "../../hooks/useGroupAPI";

export default function GroupRoomHead({
  groupTitle,
  groupAvatarUrl,
  setContentType,
}) {
  const { fileFromServer } = useFile();
  const { changeTitle, uploadGroupAvatar } = useGroupAPI();
  const { id } = useParams();
  const inputRef = useRef(null);
  const avatarRef = useRef(null);
  const [title, setTitle] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(groupTitle);
    setAvatarUrl(groupAvatarUrl);
  }, [groupTitle, groupAvatarUrl]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  const changeGroupTitle = async (e) => {
    if (e.key === "Enter") {
      await changeTitle(title, id);
      setEditing(false);
    }
  };

  const changeGroupAvatar = async (file) => {
    if (file) {
      const avatarUrl = await uploadGroupAvatar(file, id);
      setAvatarUrl(avatarUrl);
    }
  };

  const handleAvatarSelect = () => {
    avatarRef.current.click();
  };

  const handleOpenSettings = () => {
    setContentType(roomContentTypes.groupSettings);
  };

  return (
    <div className="room-head room-group-head">
      <img
        onClick={handleAvatarSelect}
        className="room-group-head-avatar"
        src={fileFromServer(folders.groupAvatars, avatarUrl)}
        alt="Avatar"
      />
      <div>
        {editing ? (
          <>
            <input
              ref={inputRef}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="room-group-head-field"
              placeholder="Нажмите Enter чтобы сохранить"
              onKeyDown={(e) => changeGroupTitle(e)}
            />
            <button
              onClick={() => changeGroupTitle({ key: "Enter" })}
              className="button room-group-head-ok"
            >
              ОК
            </button>
            <span
              onClick={() => setEditing(false)}
              className="room-group-head-cancel"
            >
              Отмена
            </span>
          </>
        ) : (
          <span onClick={() => setEditing(true)} className="room-head-text">
            {title}
          </span>
        )}
      </div>

      <img
        className="room-group-head-open-info"
        src={pointsIcon}
        alt="Group Info"
        onClick={handleOpenSettings}
      />
      <input
        onChange={(e) => changeGroupAvatar(e.target.files[0])}
        ref={avatarRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif"
      />
    </div>
  );
}
