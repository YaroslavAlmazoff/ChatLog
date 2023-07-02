import React, { useContext, useEffect, useState } from "react";
import "../../../styles/user-post.css";
import api from "../../../api/auth";
import { AuthContext } from "../../../../context/AuthContext";
import Loader from "../../../../common_components/Loader";
import FriendsPostHead from "./components/FriendsPostHead";
import Comment from "../../../../common_components/Comment";
import CommentField from "../../../parts/CommentField";
import useVerify from "../../../../common_hooks/verify.hook";

const FriendsNewsPost = ({ id }) => {
  const { verify } = useVerify();
  //const auth = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [post, setPost] = useState({ images: [], title: "", date: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [commentsDisplay, setCommentsDisplay] = useState(false);
  const [comments, setComments] = useState([]);
  const [data, setData] = useState({});
  useEffect(() => {
    const verify = async () => {
      const v = await verify();
      setData(v);
    };
  }, [verify]);
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

  const randomColor = () => {
    return colors[Math.round(Math.random() * colors.length)];
  };
  const randomShadow = () => {
    return shadows[Math.round(Math.random() * colors.length)];
  };

  useEffect(() => {
    const getPost = async () => {
      const response = await api.get(`/api/friendsnewspost/${id}`);
      console.log(response);
      if (response.data.post) {
        setPost(response.data.post);
        setLoading(false);
      } else {
        setError("Запись удалена.");
        setLoading(false);
      }
    };
    getPost();
    setImage(process.env.REACT_APP_API_URL + "/articles/" + post.images[0]);
  }, [id]);

  useEffect(() => {
    setImage(process.env.REACT_APP_API_URL + "/articles/" + post.images[0]);
    const getComments = async () => {
      const response = await api.get(`/api/userpost/comments/${post._id}`);
      setComments(response.data.comments.reverse());
    };
    getComments();
    setLikesCount(post.likes);
  }, [post]);

  useEffect(() => {
    if (localStorage.getItem(post._id) === auth.userId) {
      setLike(require("../../../../img/red-like.png"));
    }
  }, [post, auth]);

  const [like, setLike] = useState(require("../../../../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState();

  const toggleCommentsDisplay = () => {
    if (commentsDisplay) {
      setCommentsDisplay(false);
    } else {
      setCommentsDisplay(true);
    }
  };

  const mark = async () => {
    if (like === require("../../../../img/blue-like.png")) {
      localStorage.setItem(post._id, auth.userId);
      setLikesCount(likesCount + 1);
      setLike(require("../../../../img/red-like.png"));
      await api.post(
        `/api/like`,
        { id: post._id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
    } else {
      localStorage.removeItem(post._id, auth.userId);
      setLikesCount(likesCount - 1);
      setLike(require("../../../../img/blue-like.png"));
      await api.post(
        `/api/like`,
        { sub: true, id: post._id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
    }
  };

  return (
    <div className="user-post">
      {!loading ? (
        <>
          {!error ? (
            <>
              <FriendsPostHead id={id} />
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
                  className="user-post-like"
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
