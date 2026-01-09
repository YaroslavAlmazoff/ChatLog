import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import api from "../../../../auth/api/auth";
import PublicCommentField from "./PublicCommentField";
import PublicCommentItem from "./PublicCommentItem";
import { useParams } from "react-router";
import useHighlight from "../../../../common_hooks/highlight.hook";

const Post = ({ item, isAdmin, deletePost }) => {
  const auth = useContext(AuthContext);
  const params = useParams();
  const { randomColor, randomShadow } = useHighlight();
  const [image, setImage] = useState("");
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [commentsDisplay, setCommentsDisplay] = useState(false);
  const [like, setLike] = useState(require("../../../../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState();
  const [comments, setComments] = useState([]);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (item.liked) {
      setLike(require("../../../../img/red-like.png"));
    }
    setImage(process.env.REACT_APP_API_URL + "/publicposts/" + item.images[0]);
    setLikesCount(item.likes);
    setComments(item.comments.reverse());
  }, [item]);

  const mark = async () => {
    const response = await api.get(
      `/api/public/likepost/${item._id}/${item.public}`,
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    if (response.data.liked) {
      setLikesCount(likesCount + 1);
      setLike(require("../../../../img/red-like.png"));
      setLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setLike(require("../../../../img/blue-like.png"));
      setLiked(false);
    }
  };

  const toggleCommentsDisplay = () => {
    if (commentsDisplay) {
      setCommentsDisplay(false);
    } else {
      setCommentsDisplay(true);
    }
  };

  return (
    <div className="public-post">
      {isAdmin && (
        <div className="public-post-delete">
          <span
            title="Удалить статью?"
            onClick={() => deletePost(item._id)}
            className="public-post-delete"
          >
            &times;
          </span>
        </div>
      )}
      <h2 className={`public-post-title ${randomColor()} ${randomShadow()}`}>
        {item.title}
      </h2>
      <p className={`public-post-text ${randomColor()} ${randomShadow()}`}>
        {item.text}
      </p>
      {item.images.length ? (
        <img
          onLoad={() => setMainImageLoading(false)}
          className="public-post-image"
          src={image}
          alt="ad"
          style={!mainImageLoading ? { display: "block" } : { display: "none" }}
        />
      ) : null}
      <div className="public-post-images">
        {item.images.length > 1 &&
          item.images.map((el) => (
            <img
              style={
                process.env.REACT_APP_API_URL + "/publicposts/" + el === image
                  ? { border: "1px solid #40a4ff" }
                  : { border: "none" }
              }
              onClick={() =>
                setImage(process.env.REACT_APP_API_URL + "/publicposts/" + el)
              }
              className="public-post-small-image"
              src={process.env.REACT_APP_API_URL + "/publicposts/" + el}
              alt="foto"
            />
          ))}
        {likesCount > 0 ? (
          <span style={{ color: "white" }}>{likesCount}</span>
        ) : null}
        <img
          onClick={mark}
          className={`${liked ? "red-block" : "block"} user-post-like`}
          src={like}
          alt=""
        />
        {comments.length ? (
          <span style={{ color: "white" }}>{comments.length}</span>
        ) : null}
        <img
          onClick={toggleCommentsDisplay}
          className="user-post-like"
          src={require("../../../../img/comment.png")}
          alt=""
        />
      </div>
      <p className="public-post-date">От {item.date}</p>
      {commentsDisplay && (
        <div>
          <PublicCommentField
            id={item._id}
            comments={comments}
            setComments={setComments}
            publicID={params.id}
          />
          {comments.map((item) => (
            <PublicCommentItem item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
