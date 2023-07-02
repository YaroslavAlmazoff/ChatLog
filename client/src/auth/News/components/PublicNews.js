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
    if (!auth.userId) return;
    const getPosts = async () => {
      await verify();
      const response = await api.get("/api/publicnews", {
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
      {posts.map((id) => (
        <PublicNewsPost id={id} />
      ))}
    </div>
  );
};

export default PublicNews;
