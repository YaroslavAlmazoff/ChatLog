import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import deleteIcon from "../../../img/delete.png";
import editIcon from "../../../img/edit.png";
import replyIcon from "../../../img/reply.png";
import shareIcon from "../../../img/share.png";
import useAPI from "../../../hooks/useAPI";
import { EditMessageContext } from "../../../context/EditMessageContext";
import useGroupAPI from "../../../hooks/useGroupAPI";

export default function RoomMessageActions({ message, animation }) {
  const { userId } = useContext(AuthContext);
  const { setEditingMessage, isGroup } = useContext(EditMessageContext);
  const { deleteMessage } = useAPI();
  const { deleteGroupMessage } = useGroupAPI();
  const isMyMessage = message.user === userId;

  const messageActions = [
    {
      icon: deleteIcon,
      available: isMyMessage,
      onClick: async () => {
        if (isGroup) {
          await deleteGroupMessage(message);
        } else {
          await deleteMessage(message);
        }
      },
    },
    {
      icon: editIcon,
      available: isMyMessage,
      onClick: () => {
        setEditingMessage(message);
      },
    },
    { icon: replyIcon, available: true, onClick: () => {} },
    { icon: shareIcon, available: true, onClick: () => {} },
  ];

  return (
    <div className={`room-message-actions ${animation}`}>
      <span className="room-message-date">{message.date}</span>
      <div className="room-message-actions-list">
        {messageActions.map((action) =>
          action.available ? (
            <img
              onClick={action.onClick}
              src={action.icon}
              alt="Action"
              className="room-message-action"
            />
          ) : (
            <></>
          )
        )}
      </div>
    </div>
  );
}
