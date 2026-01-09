import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../auth/api/auth";
import "../videohost/styles/comment-item.css";
import "../auth/styles/user-post.css";

const Comment = ({ item }) => {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [isLike, setIsLike] = useState(false);
  const [likeImg, setLikeImg] = useState(require("../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const response = await api.get(`/api/user/${item.user}`);
      setUser(response.data.user);
    };
    getUser();
    setLikesCount(item.likes);
    const checkLike = async () => {
      const response = await api.get(`/api/check-like/${item._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data.liked) {
        setLikeImg(require("../img/red-like.png"));
        setLiked(true);
      }
    };
    checkLike();
  }, [item, auth]);

  const like = async () => {
    const response = await api.get(`/api/userpost/likecomment/${item._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response.data.liked) {
      setLikeImg(require("../img/red-like.png"));
      setLikesCount(likesCount + 1);
      setIsLike(true);
      setLiked(true);
    } else {
      setLikeImg(require("../img/blue-like.png"));
      setLikesCount(likesCount - 1);
      setIsLike(false);
      setLiked(false);
    }
  };

  const gotoUser = () => {
    window.location = `/user/${user._id}`;
  };

  return (
    <div className="videohost-comment-item">
      <div className="videohost-comment-item-avatar">
        <img
          className="videohost-comment-item-avatar-img"
          src={process.env.REACT_APP_API_URL + "/useravatars/" + user.avatarUrl}
          alt=""
        />
        <div onClick={like}>
          <span
            onClick={gotoUser}
            className="videohost-comment-item-likes-count"
          >
            {likesCount}
          </span>
          <img
            className={`${
              liked ? "red-block" : "block"
            } videohost-comment-item-like-img`}
            src={likeImg}
            alt=""
          />
        </div>
      </div>
      <div className="videohost-comment-item-main">
        <div className="videohost-comment-item-head">
          <span
            className="videohost-comment-item-author"
            style={{ cursor: "pointer" }}
          >
            {user.name} {user.surname}
          </span>
          <span className="videohost-comment-item-date">{item.date}</span>
        </div>
        <div className="videohost-comment-item-text-wrapper">
          <p className="videohost-comment-item-text">{item.comment}</p>
        </div>
      </div>
    </div>
  );
};

export default Comment;
