import { useParams } from "react-router";
import { useState, useEffect } from "react";
import UserPost from "./UserPost";
import CommonModal from "../../common_components/Modal/CommonModal";
import useArray from "../../common_hooks/array.hook";
import Loader from "../../common_components/Loader";
import api from "../api/auth";
import CreatePost from "../CreatePost";

const UserPosts = ({ showModal, setShowModal }) => {
  const { uniqueObjects } = useArray();
  const params = useParams();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isLast, setIsLast] = useState(false);

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
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      const response = await api.get(
        `/api/posts/${params.id}/${page}/${offset}`
      );
      setPosts((prev) => {
        return response.data.posts
          ? uniqueObjects(
              [...prev, ...response.data.posts].slice(0, response.data.count)
            )
          : uniqueObjects(prev.slice(0, response.data.count));
      });
      setIsLast(response.data.isLast);
      setLoading(false);
    };
    if (!isLast) {
      getPosts();
    }
  }, [page]);

  return (
    <>
      <div className="user-posts">
        <div className="user-posts-list block">
          {loading ? <Loader /> : <></>}
          {!loading && !posts[0] ? (
            <p className="nothing">Здесь нет постов.</p>
          ) : (
            posts.map((el) => (
              <UserPost key={el._id} post={el} setPosts={setPosts} />
            ))
          )}
        </div>
      </div>
      <CommonModal show={showModal} onClose={() => setShowModal(false)}>
        <CreatePost
          setPosts={setPosts}
          setOffset={setOffset}
          onClose={() => setShowModal(false)}
        />
      </CommonModal>
    </>
  );
};

export default UserPosts;
