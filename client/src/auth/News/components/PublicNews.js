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
  }, []);

  return (
    <div className="feed-public-news">
      {posts.map((id) => (
        <PublicNewsPost id={id} />
      ))}
    </div>
  );
};

export default PublicNews;
