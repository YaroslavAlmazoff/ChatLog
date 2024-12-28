import { useContext } from "react";
import "../../styles/GroupGoBack.css";
import { GroupContext } from "../../context/GroupContext";
import { roomContentTypes } from "../../data/messengerConfiguration";

export default function GroupGoBack() {
  const { contentType, setContentType, setIsMessagesVisible } =
    useContext(GroupContext);

  const goBack = () => {
    if (contentType === roomContentTypes.addMembers) {
      setContentType(roomContentTypes.groupSettings);
    } else {
      setContentType(roomContentTypes.messages);
      setIsMessagesVisible(true);
    }
  };
  return (
    <div className="group-go-back">
      <span onClick={goBack} className="group-go-back-text">
        ⭠ Назад
      </span>
    </div>
  );
}
