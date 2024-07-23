import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import deleteIcon from "../../img/delete.png";
import editIcon from "../../img/edit.png";
import replyIcon from "../../img/reply.png";
import shareIcon from "../../img/share.png";

export default function RoomMessageActions({ message, showActions }) {
  const { userId } = useContext(AuthContext);
  const isMyMessage = message.user === userId;

  const [animation, setAnimation] = useState(null);

  const messageActions = [
    { icon: deleteIcon, available: isMyMessage, onClick: () => {} },
    { icon: editIcon, available: isMyMessage, onClick: () => {} },
    { icon: replyIcon, available: true, onClick: () => {} },
    { icon: shareIcon, available: true, onClick: () => {} },
  ];

  useEffect(() => {
    if (showActions) {
      setAnimation("room-message-actions-show");
    } else {
      setAnimation("room-message-actions-hide");
    }

    return () => setAnimation(null);
  }, [showActions]);

  return (
    <div className={`room-message-actions ${animation}`}>
      <span className="room-message-date">{message.date}</span>
      <div className="room-message-actions-list">
        {messageActions.map((action) => (
          <img src={action.icon} alt="Action" className="room-message-action" />
        ))}
      </div>
    </div>
  );
}
