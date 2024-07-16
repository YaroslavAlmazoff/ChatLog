import { useContext, useEffect, useState } from "react";
import api from "../../api/auth";
import { AuthContext } from "../../../context/AuthContext";
import FriendsNewsPost from "./components/FriendsNewsPost";

const FriendsNews = () => {
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      if (!auth.userId) return;
      const response = await api.get("/api/friendsnews", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      console.log(response);
      setPosts(response.data.posts);
    };
    getPosts();
  }, [auth]);

  return (
    <div className="feed-public-news">
      {posts.length ? (
        posts.map((post) => <FriendsNewsPost post={post} />)
      ) : (
        <span style={{ marginBottom: "20px" }}>У Вас нет новостей</span>
      )}
    </div>
  );
};

export default FriendsNews;
