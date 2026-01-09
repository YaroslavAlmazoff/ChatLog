import React, { useContext, useEffect, useState } from "react";
import "../styles/user-post.css";
import api from "../api/auth";
import { AuthContext } from "../../context/AuthContext";
import CommentField from "./CommentField";
import Comment from "../../common_components/Comment";
import CommonModal from "../../common_components/Modal/CommonModal";
import useHighlight from "../../common_hooks/highlight.hook";
import { ProfileContext } from "../context/ProfileContext";

const UserPost = ({ post, setPosts }) => {
  const auth = useContext(AuthContext);
  const { randomColor, randomShadow } = useHighlight();
  const { isOwner } = useContext(ProfileContext);
  const [image, setImage] = useState("");
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [commentsDisplay, setCommentsDisplay] = useState(false);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const getComments = async () => {
      const response = await api.get(`/api/userpost/comments/${post._id}`);
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
        setLiked(true);
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
      setLiked(true);
    } else {
      setLikesCount(likesCount - 1);
      setLike(require("../../img/blue-like.png"));
      setLiked(false);
    }
  };
  const deletePost = async () => {
    await api.delete(`/api/deleteuserpost/${post._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setPosts((prev) => [...prev].filter((el) => el._id !== post._id));
  };
  const toggleCommentsDisplay = () => {
    if (commentsDisplay) {
      setCommentsDisplay(false);
    } else {
      setCommentsDisplay(true);
    }
  };

  const onConfirm = () => {
    setShowModal(false);
    deletePost();
  };

  return (
    <div className="user-post">
      <CommonModal show={showModal} onClose={() => setShowModal(false)}>
        <span>Вы действительно хотите удалить этот пост?</span>
        <div className="flex-start mt10">
          <button className="button-neon-red mr" onClick={onConfirm}>
            Удалить
          </button>
          <span className="cancel-button" onClick={() => setShowModal(false)}>
            Отмена
          </span>
        </div>
      </CommonModal>
      {isOwner && (
        <div className="user-post-delete">
          <span
            title="Удалить запись?"
            onClick={() => setShowModal(true)}
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
