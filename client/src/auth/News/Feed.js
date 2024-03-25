import { useState } from "react";
import FriendsNews from "./components/FriendsNews";
import PublicNews from "./components/PublicNews";
import "./feed.css";

const Feed = () => {
  const [publicPostsDisplay, setPublicPostsDisplay] = useState(true);
  const [friendsPostsDisplay, setFriendsPostsDisplay] = useState(false);

  const toPublicPosts = () => {
    setPublicPostsDisplay(true);
    setFriendsPostsDisplay(false);
  };
  const toFriendsPosts = () => {
    setFriendsPostsDisplay(true);
    setPublicPostsDisplay(false);
  };

  return (
    <div className="feed block">
      <div className="feed-nav">
        <button
          onClick={toPublicPosts}
          className="feed-nav-button"
          style={
            publicPostsDisplay
              ? { borderBottom: "2px solid rgb(0, 140, 255)" }
              : { border: "none" }
          }
        >
          Новости
        </button>
        <button
          onClick={toFriendsPosts}
          className="feed-nav-button"
          style={
            friendsPostsDisplay
              ? { borderBottom: "2px solid rgb(0, 140, 255)" }
              : { border: "none" }
          }
        >
          Записи друзей
        </button>
      </div>
      <div className="feed-content">
        {publicPostsDisplay && <PublicNews />}
        {friendsPostsDisplay && <FriendsNews />}
      </div>
    </div>
  );
};

export default Feed;
