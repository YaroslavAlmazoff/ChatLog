import { useContext, useEffect, useState } from "react";
import api from "../../api/auth";
import { AuthContext } from "../../../context/AuthContext";
import PublicNewsPost from "./components/PublicNewsPost";
import useVerify from "../../../common_hooks/verify.hook";

const PublicNews = () => {
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const { verify } = useVerify();

  useEffect(() => {
    const getPosts = async () => {
      const data = await verify();
      const response = await api.get("/api/publicnews", {
        headers: {
          Authorization: `Bearer ${data.token}`,
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
