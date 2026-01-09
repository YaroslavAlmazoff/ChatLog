import { useContext } from "react";
import { GroupContext } from "../../../context/GroupContext";
import { AuthContext } from "../../../../context/AuthContext";
import useGroupAPI from "../../../hooks/useGroupAPI";
import "../../../styles/GroupActions.css";
import "../../../styles/GroupSettings.css";
import { roomContentTypes } from "../../../data/messengerConfiguration";

export default function GroupActions() {
  const { leaveGroup, deleteGroup } = useGroupAPI();
  const { room, setContentType } = useContext(GroupContext);
  const { userId } = useContext(AuthContext);
  const isCreator = userId === room.creator;

  const handleLeaveGroup = async () => {
    await leaveGroup(room.id);
    window.location = "/messages";
  };

  const handleDeleteGroup = async () => {
    await deleteGroup(room.id);
    window.location = "/messages";
  };

  const handleAddMembers = () => {
    setContentType(roomContentTypes.addMembers);
  };

  return (
    <div className="group-settings-part underlined-block">
      {isCreator ? (
        <span onClick={handleDeleteGroup} className="group-action">
          Удалить беседу
        </span>
      ) : (
        <span onClick={handleLeaveGroup} className="group-action">
          Выйти из беседы
        </span>
      )}
      <span onClick={handleAddMembers} className="group-action">
        Добавить участников
      </span>
    </div>
  );
}
