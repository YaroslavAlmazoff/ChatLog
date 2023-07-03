import { useContext, useEffect, useState } from "react";
import api from "../../api/auth";
import { AuthContext } from "../../../context/AuthContext";
import FriendsNewsPost from "./components/FriendsNewsPost";
import useVerify from "../../../common_hooks/verify.hook";

const FriendsNews = () => {
  const auth = useContext(AuthContext);
  const { verify } = useVerify();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getPosts = async () => {
      const data = await verify();
      const response = await api.get("/api/friendsnews", {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });
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
