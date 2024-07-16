import { useContext, useEffect, useState } from "react";
import api from "../../api/auth";
import { AuthContext } from "../../../context/AuthContext";
import PublicNewsPost from "./components/PublicNewsPost";

const PublicNews = () => {
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      if (!auth.userId) return;
      const response = await api.get("/api/publicnews", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setPosts(response.data.posts);
    };
    getPosts();
  }, [auth]);

  return (
    <div className="feed-public-news">
      {posts.length ? (
        posts.map((post) => <PublicNewsPost post={post} />)
      ) : (
        <span style={{ marginBottom: "20px" }}>У Вас нет новостей</span>
      )}
    </div>
  );
};

export default PublicNews;
