import { useContext, useEffect, useState } from "react";
import api from "../../../api/auth";
import "../../../styles/user-post.css";
import Loader from "../../../../common_components/Loader";
import PublicPostHead from "./components/PublicPostHead";
import { AuthContext } from "../../../../context/AuthContext";
import PublicCommentField from "../../../../publics/components/components/components/PublicCommentField";
import PublicCommentItem from "../../../../publics/components/components/components/PublicCommentItem";
import useHighlight from "../../../../common_hooks/highlight.hook";

const PublicNewsPost = ({ post }) => {
  const auth = useContext(AuthContext);
  const { randomColor, randomShadow } = useHighlight();
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [commentsDisplay, setCommentsDisplay] = useState(false);
  const [comments, setComments] = useState([]);
  const [like, setLike] = useState(require("../../../../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState();
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (post.liked) {
      setLike(require("../../../../img/red-like.png"));
      setLiked(true);
    }
    setImage(process.env.REACT_APP_API_URL + "/publicposts/" + post.images[0]);
    setLikesCount(post.likes);
    setComments(post.comments.reverse());
  }, [post]);

  const mark = async () => {
    const response = await api.get(
      `/api/public/likepost/${post._id}/${post.public}`,
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
    <div className="user-post">
      {!loading ? (
        <>
          {!error ? (
            <>
              <PublicPostHead id={post._id} />
              <h2
                className={`user-post-title ${randomColor()} ${randomShadow()}`}
              >
                {post.title}
              </h2>
              <p
                className={`user-post-text ${randomColor()} ${randomShadow()}`}
              >
                {post.text}
              </p>
              {post.images.length ? (
                <img
                  onLoad={() => setMainImageLoading(false)}
                  className="user-post-image"
                  src={image}
                  alt="ad"
                  style={
                    !mainImageLoading
                      ? { display: "block" }
                      : { display: "none" }
                  }
                />
              ) : null}
              <div className="user-post-images">
                {post.images.length > 1 &&
                  post.images.map((el) => (
                    <img
                      style={
                        process.env.REACT_APP_API_URL + "/publicposts/" + el ===
                        image
                          ? { border: "1px solid #40a4ff" }
                          : { border: "none" }
                      }
                      onClick={() =>
                        setImage(
                          process.env.REACT_APP_API_URL + "/publicposts/" + el
                        )
                      }
                      className="user-post-small-image"
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
              <p className="user-post-date">От {post.date}</p>
            </>
          ) : (
            <></>
          )}
          <>
            {commentsDisplay && (
              <div>
                <PublicCommentField
                  id={post._id}
                  comments={comments}
                  setComments={setComments}
                  publicID={post.public}
                />
                {comments.map((item) => (
                  <PublicCommentItem item={item} />
                ))}
              </div>
            )}
          </>
        </>
      ) : (
        <Loader ml={"50%"} />
      )}
    </div>
  );
};

export default PublicNewsPost;
