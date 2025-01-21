import { Link } from "react-router-dom";

const SimpleFriends = ({ title, from }) => {
  return (
    <div>
      <h3 className="notice-title" style={{ color: "white" }}>
        {title}
        <Link style={{ color: "white" }} to={`/user/${from}`}>
          {" "}
          Посмотреть его профиль
        </Link>
      </h3>
    </div>
  );
};

export default SimpleFriends;
