import { useState } from "react";
import UserActions from "./UserActions";
import UserPosts from "./UserPosts";
import "../styles/user.css";

const UserCenterSide = () => {
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  return (
    <div className="user-center-side">
      <UserActions setShowCreatePostModal={setShowCreatePostModal} />
      <UserPosts
        showModal={showCreatePostModal}
        setShowModal={setShowCreatePostModal}
      />
    </div>
  );
};

export default UserCenterSide;
