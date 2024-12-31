import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { GroupContext } from "../../../context/GroupContext";
import useFile from "../../../hooks/useFile";
import useGroupAPI from "../../../hooks/useGroupAPI";
import "../../../styles/GroupInfo.css";
import "../../../styles/GroupSettings.css";
import { folders } from "../../../data/messengerConfiguration";

export default function GroupInfo() {
  const { room, updateRoom } = useContext(GroupContext);
  const { fileFromServer } = useFile();
  const { editGroup } = useGroupAPI();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setTitle(room.title);
    setDescription(room.description);
    setAvatarUrl(room.avatarUrl);
  }, [room]);

  const save = async () => {
    await editGroup(title, description, id);
    updateRoom(title, description);
    setEditing(false);
  };

  const cancel = () => {
    setTitle(room.title);
    setDescription(room.description);
    setAvatarUrl(room.avatarUrl);
    setEditing(false);
  };

  return (
    <div className="group-settings-part underlined-block">
      <div className="group-info-top">
        <img
          className="group-info-avatar"
          src={fileFromServer(folders.groupAvatars, avatarUrl)}
          alt="Avatar"
        />
        {editing ? (
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input group-info-title-field"
            type="text"
            placeholder="Название беседы"
          />
        ) : (
          <span onClick={() => setEditing(true)} className="group-info-title">
            {title}
          </span>
        )}
      </div>
      {editing || !description ? (
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="input group-info-description-field"
          placeholder="Информация"
        >
          {description}
        </textarea>
      ) : (
        <span
          onClick={() => setEditing(true)}
          className="group-info-description"
        >
          {description}
        </span>
      )}
      <div className="group-info-actions">
        <button onClick={save} className="button">
          Сохранить
        </button>
        <span onClick={cancel} className="group-info-cancel">
          Отменить изменения
        </span>
      </div>
    </div>
  );
}
