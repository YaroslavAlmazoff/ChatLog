import { useContext } from "react";
import "../../styles/GroupGoBack.css";
import { GroupContext } from "../../context/GroupContext";
import { roomContentTypes } from "../../data/messengerConfiguration";

export default function GroupGoBack() {
  const { contentType, setContentType } = useContext(GroupContext);
  return (
    <div className="group-go-back">
      <span
        onClick={() =>
          setContentType(
            contentType === roomContentTypes.addMembers
              ? roomContentTypes.groupSettings
              : roomContentTypes.messages
          )
        }
        className="group-go-back-text"
      >
        ⭠ Назад
      </span>
    </div>
  );
}
