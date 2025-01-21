import { Link } from "react-router-dom";

const Friends = ({ title, from, reply }) => {
  return (
    <div>
      <h3 className="notice-title" style={{ color: "white" }}>
        {title}
        <Link style={{ color: "white" }} to={`/user/${from}`}>
          {" "}
          Посмотреть его профиль
        </Link>
      </h3>
      <div>
        <button onClick={() => reply(true)} className="notice-button">
          Принять
        </button>
        <button onClick={() => reply(false)} className="notice-button">
          Отклонить
        </button>
      </div>
    </div>
  );
};

export default Friends;
