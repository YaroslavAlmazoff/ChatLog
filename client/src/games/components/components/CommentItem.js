import { useState, useEffect, useContext } from "react";
import api from "../../../auth/api/auth";
import useHighlight from "../../../common_hooks/highlight.hook";
import { AuthContext } from "../../../context/AuthContext";
import "../../../videohost/styles/comment-item.css";

const GameCommentItem = ({ item }) => {
  const auth = useContext(AuthContext);
  const [user, setUser] = useState({});
  const [isLike, setIsLike] = useState(false);
  const [likeImg, setLikeImg] = useState(require("../../../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState(0);

  const { randomShadow, randomColor, randomBlockShadow } = useHighlight();

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
        setLikeImg(require("../../../img/red-like.png"));
      }
    };
    checkLike();
  }, [item, auth]);

  const like = async () => {
    const response = await api.get(`/api/games/likecomment/${item._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    if (response.data.liked) {
      setLikeImg(require("../../../img/red-like.png"));
      setLikesCount(likesCount + 1);
      setIsLike(true);
    } else {
      setLikeImg(require("../../../img/blue-like.png"));
      setLikesCount(likesCount - 1);
      setIsLike(false);
    }
  };

  return (
    <div
      className={`videohost-comment-item ${randomBlockShadow()}`}
      style={window.innerWidth < 500 ? { width: "92%" } : { width: "60%" }}
    >
      <div className="videohost-comment-item-avatar">
        <img
          className={`videohost-comment-item-avatar-img ${randomBlockShadow()}`}
          src={process.env.REACT_APP_API_URL + "/useravatars/" + user.avatarUrl}
          alt=""
        />
        <div onClick={like}>
          <span className="videohost-comment-item-likes-count">
            {likesCount}
          </span>
          <img
            className="videohost-comment-item-like-img"
            src={likeImg}
            alt=""
          />
        </div>
      </div>
      <div className="videohost-comment-item-main">
        <div className="videohost-comment-item-head">
          <span
            className={`videohost-comment-item-author ${randomColor()} ${randomShadow()}`}
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

export default GameCommentItem;
