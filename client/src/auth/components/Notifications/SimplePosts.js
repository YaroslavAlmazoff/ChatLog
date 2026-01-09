import { Link } from "react-router-dom";

const SimplePosts = ({ title, postType, postID }) => {
  return (
    <div>
      <h3 className="notice-title" style={{ color: "white" }}>
        {title}
        <Link style={{ color: "white" }} to={`/${postType}/${postID}`}>
          {" "}
          Посмотреть
        </Link>
      </h3>
    </div>
  );
};

export default SimplePosts;
