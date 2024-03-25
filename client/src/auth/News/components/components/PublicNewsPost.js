import { useContext, useEffect, useState } from "react";
import api from "../../../api/auth";
import "../../../styles/user-post.css";
import Loader from "../../../../common_components/Loader";
import PublicPostHead from "./components/PublicPostHead";
import { AuthContext } from "../../../../context/AuthContext";
import PublicCommentField from "../../../../publics/components/components/components/PublicCommentField";
import PublicCommentItem from "../../../../publics/components/components/components/PublicCommentItem";

const PublicNewsPost = ({ id }) => {
  const auth = useContext(AuthContext);
  const [image, setImage] = useState("");
  const [post, setPost] = useState({
    images: [],
    title: "",
    text: "",
    date: "",
    _id: "630cd7d5be8d2f7728d1e691",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [mainImageLoading, setMainImageLoading] = useState(true);
  const [commentsDisplay, setCommentsDisplay] = useState(false);
  const [comments, setComments] = useState([]);
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

  const randomColor = () => {
    return colors[Math.round(Math.random() * colors.length)];
  };
  const randomShadow = () => {
    return shadows[Math.round(Math.random() * colors.length)];
  };

  useEffect(() => {
    setImage(process.env.REACT_APP_API_URL + "/publicposts/" + post.images[0]);
    setLikesCount(post.likes);
    const getComments = async () => {
      const response = await api.get(`/api/public/comments/${post._id}`);
      console.log(response);
      setComments(response.data.comments.reverse());
      setCommentsDisplay(true);
    };
    getComments();
    const checkLike = async () => {
      const response = await api.get(`/api/check-like/${post._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      if (response.data.liked) {
        setLike(require("../../../../img/red-like.png"));
        setLikeClass("red-block-glow");
      }
    };
    checkLike();
  }, [post, auth]);

  useEffect(() => {
    const getPost = async () => {
      const response = await api.get(`/api/publicnewspost/${id}`);
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
  }, [id]);

  const [like, setLike] = useState(require("../../../../img/blue-like.png"));
  const [likesCount, setLikesCount] = useState();

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
    } else {
      setLikesCount(likesCount - 1);
      setLike(require("../../../../img/blue-like.png"));
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
              <PublicPostHead id={id} />
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
                          ? { border: "1px solid rgb(0, 140, 255)" }
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
