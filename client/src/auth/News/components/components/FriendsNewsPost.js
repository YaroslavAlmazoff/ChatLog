import React, { useContext, useEffect, useState } from "react";
import "../../../styles/user-post.css";
import api from "../../../api/auth";
import { AuthContext } from "../../../../context/AuthContext";
import Loader from "../../../../common_components/Loader";
import FriendsPostHead from "./components/FriendsPostHead";
import Comment from "../../../../common_components/Comment";
import CommentField from "../../../components/CommentField";
import useHighlight from "../../../../common_hooks/highlight.hook";

const FriendsNewsPost = ({ post }) => {
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
    setImage(process.env.REACT_APP_API_URL + "/articles/" + post.images[0]);
    setLikesCount(post.likes);
    setComments(post.comments.reverse());
  }, [post]);

  const toggleCommentsDisplay = () => {
    if (commentsDisplay) {
      setCommentsDisplay(false);
    } else {
      setCommentsDisplay(true);
    }
  };

  const mark = async () => {
    const response = await api.get(`/api/like/${post._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
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

  return (
    <div className="user-post">
      {!loading ? (
        <>
          {!error ? (
            <>
              <FriendsPostHead id={post._id} />
              <p
                className={`user-post-text ${randomColor()} ${randomShadow()}`}
              >
                {post.title}
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
                        process.env.REACT_APP_API_URL + "/articles/" + el ===
                        image
                          ? { border: "1px solid rgb(0, 140, 255)" }
                          : { border: "none" }
                      }
                      onClick={() =>
                        setImage(
                          process.env.REACT_APP_API_URL + "/articles/" + el
                        )
                      }
                      className="user-post-small-image"
                      src={process.env.REACT_APP_API_URL + "/articles/" + el}
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
            <p style={{ color: "white" }}>{error}</p>
          )}
          <>
            {commentsDisplay && (
              <div>
                <CommentField
                  id={post._id}
                  comments={comments}
                  setComments={setComments}
                />
                {comments.map((item) => (
                  <Comment item={item} />
                ))}
              </div>
            )}
          </>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default FriendsNewsPost;
