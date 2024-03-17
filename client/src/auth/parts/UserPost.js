import React, { useContext, useEffect, useState } from "react";
import "../styles/user-post.css";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import CommentField from "./CommentField";
import Comment from "../../common_components/Comment";
import ModalWindow from "../../common_components/modal-window/ModalWindow";

const UserPost = ({
  post,
  isOwner,
  userPosts = [],
  setUserPosts = () => {},
}) => {
  const auth = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [commentsDisplay, setCommentsDisplay] = useState(false);
  const [comments, setComments] = useState([]);
  const [modal, setModal] = useState(false);
  const [likeClass, setLikeClass] = useState("blue-block-glow");
  const [colors] = useState([
    "color-neon-blue",
    "color-neon-orange",
    "color-neon-green",
    "color-neon-purple",
    "color-neon-pink",
    "color-neon-navy",
  ]);
  const [shadows] = useState([
    "blue-text-glow",
    "orange-text-glow",
    "green-text-glow",
    "purple-text-glow",
    "pink-text-glow",
    "navy-text-glow",
  ]);

  const openWindow = () => {
    setModal(true);
    auth.darkScreen(true);
  };
  const closeWindow = () => {
    setModal(false);
    auth.darkScreen(false);
  };

  const randomColor = () => {
    return colors[Math.round(Math.random() * colors.length)];
  };
  const randomShadow = () => {
    return shadows[Math.round(Math.random() * colors.length)];
  };

  useEffect(() => {
    const getComments = async () => {
      const response = await api.get(`/api/userpost/comments/${post._id}`);
      console.log("comments", response);
      setComments(response.data.comments.reverse());
    };
    const checkLike = async () => {
      const response = await api.get(`/api/check-like/${post._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data.liked) {
        setLike(require("../../img/red-like.png"));
        setLikeClass("red-block-glow");
      }
    };
    getComments();
    checkLike();
    setImage(process.env.REACT_APP_API_URL + "/articles/" + post.images[0]);
    setLikesCount(post.likes);
  }, [post, auth]);

  const [like, setLike] = useState(require("../../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState();

  const mark = async () => {
    const response = await api.get(`/api/like/${post._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response.data.liked) {
      setLikesCount(likesCount + 1);
      setLike(require("../../img/red-like.png"));
      setLikeClass("red-block-glow");
    } else {
      setLikesCount(likesCount - 1);
      setLike(require("../../img/blue-like.png"));
      setLikeClass("blue-block-glow");
    }
  };
  const deletePost = async () => {
    setUserPosts([...userPosts].filter((el) => el._id !== post._id));
    await api.delete(`/api/deleteuserpost/${post._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
  };
  const toggleCommentsDisplay = () => {
    if (commentsDisplay) {
      setCommentsDisplay(false);
    } else {
      setCommentsDisplay(true);
    }
  };

  const onConfirm = () => {
    deletePost();
    auth.darkScreen(false);
  };

  return (
    <div className="user-post">
      {modal && (
        <ModalWindow
          isOpen={modal}
          onClose={closeWindow}
          onConfirm={onConfirm}
          text="Вы действительно хотите удалить этот пост?"
        />
      )}
      {isOwner && (
        <div className="user-post-delete">
          <span
            title="Удалить запись?"
            onClick={openWindow}
            className="public-post-delete"
          >
            &times;
          </span>
        </div>
      )}
      <p className={`user-post-text ${randomColor()} ${randomShadow()}`}>
        {post.title}
      </p>
      {post.images.length ? (
        <img
          onLoad={() => setMainImageLoading(false)}
          className="user-post-image"
          src={image}
          alt="ad"
          style={!mainImageLoading ? { display: "block" } : { display: "none" }}
        />
      ) : null}
      <div className="user-post-images">
        {post.images.length > 1 &&
          post.images.map((el) => (
            <img
              style={
                process.env.REACT_APP_API_URL + "/articles/" + el === image
                  ? { border: "1px solid rgb(0, 140, 255)" }
                  : { border: "none" }
              }
              onClick={() =>
                setImage(process.env.REACT_APP_API_URL + "/articles/" + el)
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
          className="block user-post-like"
          src={like}
          alt=""
        />
        {comments.length ? (
          <span style={{ color: "white" }}>{comments.length}</span>
        ) : null}
        <img
          onClick={toggleCommentsDisplay}
          className="user-post-like"
          src={require("../../img/comment.png")}
          alt=""
        />
      </div>
      <p className="user-post-date">От {post.date}</p>
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
    </div>
  );
};
export default UserPost;
