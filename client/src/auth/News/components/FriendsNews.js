import { useContext, useEffect, useState } from "react";
import api from "../../api/auth";
import { AuthContext } from "../../../context/AuthContext";
import FriendsNewsPost from "./components/FriendsNewsPost";
import useVerify from "../../../common_hooks/verify.hook";

const FriendsNews = () => {
  const auth = useContext(AuthContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!auth.userId || !auth.token) return;
    const getPosts = async () => {
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
      {posts.map((id) => (
        <FriendsNewsPost id={id} />
      ))}
    </div>
  );
};

export default FriendsNews;
