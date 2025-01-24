import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router";
import api from "./api/auth";
import UserRightSide from "./components/UserRightSide";
import UserCenterSide from "./components/UserCenterSide";
import UserLeftSide from "./components/UserLeftSide";
import UserNav from "./components/UserNav";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";
import { ProfileContext } from "./context/ProfileContext";
import Nav from "./components/Mobile/Nav";
import Friends from "./components/Mobile/Friends";
import Actions from "./components/Mobile/Actions";
import Fotos from "./components/Mobile/Fotos";
import Videos from "./components/Mobile/Videos";
import useVerify from "../common_hooks/verify.hook";
import Hint from "../common_components/Hint";
import useIsMobile from "../common_hooks/isMobile.hook";
import "./styles/user.css";

const User = () => {
  const auth = useContext(AuthContext);
  const { verify } = useVerify();
  const { isMobile } = useIsMobile();
  const params = useParams();

  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [friends, setFriends] = useState([]);
  const [subscribes, setSubscribes] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintText, setHintText] = useState(false);
  const [user, setUser] = useState({
    name: "",
    surname: "",
    age: 0,
    avatarUrl: "user.png",
    bannerUrl: "",
    friendsCount: [],
    subscribesCount: [],
  });

  const hint = (text) => {
    setHintText(text);
    setShowHint(true);
  };

  useEffect(() => {
    verify();
    setIsOwner(auth.userId === params.id);
    const getUser = async () => {
      const response = await api.get(`/api/user-profile/${params.id}`);

      console.log(response);

      setUser(response.data.user);
      setFriends(response.data.friends);
      setSubscribes(response.data.subscribes);
      setPhotos(response.data.photos.reverse());
      setNotifications(response.data.notifications);
      setLoading(false);
    };
    const visit = async () => {
      await api.get(`/api/visit/${params.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
    };
    getUser();
    visit();
  }, [params, auth]);

  return (
    <div>
      <Hint show={showHint} setShow={setShowHint} text={hintText} />
      <ProfileContext.Provider
        value={{
          hint,
          isOwner,
          isMobile,
          user,
          friends,
          setFriends,
          subscribes,
          setSubscribes,
          photos,
          setPhotos,
          notifications,
          setNotifications,
        }}
      >
        {!isMobile ? (
          <div className="user">
            {!loading ? (
              <>
                <UserNav />
                <div className="user-content">
                  <UserLeftSide />
                  <UserCenterSide />
                  <UserRightSide />
                </div>
              </>
            ) : (
              <Loader />
            )}
          </div>
        ) : (
          <></>
          // <div className="user-mobile">
          //   <Nav
          //     user={user}
          //     noticeDisplay={noticeDisplay}
          //     setNoticeDisplay={setNoticeDisplay}
          //     noticeText={noticeText}
          //     noticeRef={noticeRef}
          //   />
          //   <Friends
          //     userFriends={userFriends}
          //     isOwner={isOwner}
          //     setUserFriends={setUserFriends}
          //     setNoticeDisplay={setNoticeDisplay}
          //     setNoticeText={setNoticeText}
          //     noticeRef={noticeRef}
          //   />
          //   <Actions
          //     isOwner={isOwner}
          //     setNoticeDisplay={setNoticeDisplay}
          //     setNoticeText={setNoticeText}
          //     noticeRef={noticeRef}
          //     notificationsDisplay={notificationsDisplay}
          //     setNotificationsDisplay={setNotificationsDisplay}
          //   />
          //   {notificationsDisplay ? (
          //     <Notifications
          //       showNotifications={showNotifications}
          //       notifications={notifications}
          //       setNotifications={setNotifications}
          //       userFriends={userFriends}
          //       setUserFriends={setUserFriends}
          //       setNoticeDisplay={setNoticeDisplay}
          //       setNoticeText={setNoticeText}
          //       noticeRef={noticeRef}
          //       params={params}
          //     />
          //   ) : (
          //     <></>
          //   )}
          //   <Fotos
          //     userFotos={userFotos}
          //     setUserFotos={setUserFotos}
          //     isOwner={isOwner}
          //     showNotifications={showNotifications}
          //     getFile2={getFile2}
          //     emitOpen2={emitOpen2}
          //     fileRef2={fileRef2}
          //     file2={file2}
          //     imagePreviewDisplay2={imagePreviewDisplay2}
          //     imagePreviewUrl2={imagePreviewUrl2}
          //   />
          //   <Videos
          //     deletePost={deletePost}
          //     userPosts={userPosts}
          //     setUserPosts={setUserPosts}
          //     isOwner={isOwner}
          //     userVideos={userVideos}
          //     setUserVideos={setUserVideos}
          //     deleteVideo={deleteVideo}
          //   />
          // </div>
        )}
      </ProfileContext.Provider>
    </div>
  );
};

export default User;
