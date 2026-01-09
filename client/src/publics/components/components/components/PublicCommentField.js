import { useContext, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../auth/api/auth";
import useDate from "../../../../common_hooks/date.hook";
import { AuthContext } from "../../../../context/AuthContext";
import { COMMENT_NOTIFICATION } from "../../../../publicNotificationTypes";
import "../../../../videohost/styles/comment-field.css";
import "../../../../videohost/styles/form.css";

const PublicCommentField = ({ id, comments, setComments, publicID }) => {
  const auth = useContext(AuthContext);
  const [text, setText] = useState("");
  const { getCurrentDate } = useDate();

  const send = async () => {
    const date = getCurrentDate();
    const response = await api.post(
      `/api/public/comment/${id}`,
      { date, text, pub: publicID },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    setText("");
    setComments([response.data.comment, ...comments]);
  };

  return (
    <div className="videohost-comment-field">
      <p className="videohost-comment-field-title" style={{ color: "white" }}>
        Комментарий
      </p>
      <textarea
        className="videohost-create-area"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Ваш комментарий"
      ></textarea>
      <button onClick={send} className="videohost-create-empty-button">
        Отправить
      </button>
    </div>
  );
};

export default PublicCommentField;
