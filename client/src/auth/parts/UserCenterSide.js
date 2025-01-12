import UserPost from "./UserPost";
import "../styles/user.css";
import UserVideo from "./UserVideo";
import { useParams } from "react-router";
import ModalWindow from "../../common_components/modal-window/ModalWindow";
import { useState } from "react";
import Loader from "../../common_components/Loader";

const UserCenterSide = ({
  deletePost,
  divideWord,
  isOwner,
  userVideos,
  deleteVideo,
  setUserVideos,
}) => {
  const { uniqueObjects } = useArray();
  const params = useParams();
  const isAdmin = params.id === "628e5aab0153706a3e18fe79";
  const gotoCreatePostPage = () => {
    window.location = "/createpost";
  };
  const gotoAdmin = () => {
    window.location = `/admin`;
  };

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      !isLast && setLoading(true);
      const response = await api.get(`/api/posts/${params.id}/${page}`);
      setPosts((prev) =>
        response.data.posts
          ? uniqueObjects(
              [...prev, ...response.data.posts].slice(0, response.data.count)
            )
          : uniqueObjects(prev.slice(0, response.data.count))
      );
      setIsLast(response.data.isLast);
      setLoading(false);
    };
    fetchPosts();
  }, [page]);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const pageHeight = document.documentElement.scrollHeight;
      if (scrollTop + windowHeight >= pageHeight) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", onScroll);

    const getFirstPosts = async () => {
      if (!auth.userId) return;
      setLoading(true);
      const response = await api.get(`/api/posts/${params.id}/${page}`);
      setPosts(response.data.posts);
      setLoading(false);
    };
    if (posts.length === 0) {
      getFirstPosts();
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [page]);

  return (
    <div className="user-center-side">
      <div className="center-side-buttons">
        {isOwner ? (
          <button
            className="button margin-top-bottom center-side-button"
            onClick={gotoCreatePostPage}
          >
            Создать новую запись
          </button>
        ) : (
          <></>
        )}
        {isOwner && isAdmin ? (
          <button className="button margin-top-bottom ml" onClick={gotoAdmin}>
            Кабинет администратора
          </button>
        ) : (
          <></>
        )}
      </div>
      <div
        className="user-videos"
        style={{ display: !userVideos[0] ? "none" : "block" }}
      >
        {!userVideos[0] ? (
          <p className="nothing">Здесь нет видео.</p>
        ) : (
          userVideos.map((el) => (
            <UserVideo
              key={el._id}
              deletePost={deletePost}
              setUserVideos={setUserVideos}
              userVideos={userVideos}
              id={el._id}
              title={el.title}
              date={el.date}
              imageUrl={el.imageUrl}
              likes={el.likes}
              comments={el.comments}
              deleteVideo={deleteVideo}
              divideWord={divideWord}
              setUserPosts={setPosts}
              userPosts={posts}
              isOwner={isOwner}
            />
          ))
        )}
      </div>

      <div className="user-posts">
        <div className="user-posts-list block">
          {loading ? <Loader /> : <></>}
          {!loading && !posts[0] ? (
            <p className="nothing">Здесь нет постов.</p>
          ) : (
            posts.map((el) => (
              <UserPost
                post={el}
                key={el._id}
                deletePost={deletePost}
                setUserPosts={setPosts}
                userPosts={posts}
                isOwner={isOwner}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCenterSide;
