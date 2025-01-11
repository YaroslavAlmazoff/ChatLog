import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles/user.css";
import { useParams } from "react-router";
import api from "./api/auth";
import useDate from "../common_hooks/date.hook";
import UserRightSide from "./parts/UserRightSide";
import UserCenterSide from "./parts/UserCenterSide";
import UserLeftSide from "./parts/UserLeftSide";
import UserNav from "./parts/UserNav";
import useWord from "../common_hooks/divideWord.hook";
import usePosts from "./hooks/usePosts";
import Notifications from "./parts/Notifications";
import Loader from "../common_components/Loader";
import { AuthContext } from "../context/AuthContext";

import Nav from "./parts/Mobile/Nav";
import Friends from "./parts/Mobile/Friends";
import Actions from "./parts/Mobile/Actions";
import Fotos from "./parts/Mobile/Fotos";
import Videos from "./parts/Mobile/Videos";
import useVerify from "../common_hooks/verify.hook";

const User = () => {
  const auth = useContext(AuthContext);
  const { send, sendFoto, deleteFoto, deletePost, deleteVideo } = usePosts();
  const { divideWord } = useWord();
  const { getCurrentDate } = useDate();
  const params = useParams();
  const fileRef2 = useRef();

  const [userPosts, setUserPosts] = useState([]);
  const [userVideos, setUserVideos] = useState([]);
  const [isOwner, setIsOwner] = useState(false);

  const [imagePreviewDisplay2, setImagePreviewDisplay2] = useState("none");
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState("");
  const [userFriends, setUserFriends] = useState([]);
  const [userSubscribes, setUserSubscribes] = useState([]);
  const [userFotos, setUserFotos] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [noticeDisplay, setNoticeDisplay] = useState("none");
  const [noticeText, setNoticeText] = useState("Уведомление");
  const [notificationsDisplay, setNotificationsDisplay] = useState(false);
  const [file2, setFile2] = useState("");
  const noticeRef = useRef();
  const notificationRef = useRef(null);
  const showNotifications = async () => {
    await api.get(`/api/checknotification/${auth.userId}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!notificationsDisplay) {
      notificationRef.current.remove();
      setNotificationsDisplay(true);
    } else {
      setNotificationsDisplay(false);
    }
  };
  const [user, setUser] = useState({
    name: "",
    surname: "",
    age: 0,
    avatarUrl: "user.png",
    bannerUrl: "",
    friends: [],
    subscribes: [],
    articles: [],
    fotos: [],
  });
  const emitOpen2 = () => {
    fileRef2.current.click();
  };

  const getFile2 = async (e) => {
    let file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreviewDisplay2("flex");
      setImagePreviewUrl2(ev.target.result);
    };
    reader.readAsDataURL(file);
    setFile2(file);
  };
  const { verify } = useVerify();
  useEffect(() => {
    verify();
    setIsOwner(auth.userId === params.id);
    const findUser = async () => {
      const userdata = await api.get(`/api/user/${params.id}`);
      setUser(userdata.data.user);
      const friendsResponse = await api.get(`/api/10-friends/${params.id}`);
      setUserFriends(friendsResponse.data.friends);
      const subscribesResponse = await api.get(
        `/api/public/10-subscribes/${params.id}`
      );
      setUserSubscribes(subscribesResponse.data.subscribes);
      const response = await api.get(`/api/getuserposts/${params.id}`);
      setUserPosts(response.data.articles.reverse());
      const response2 = await api.get(`/api/getuserfotos/${params.id}`);
      setUserFotos(response2.data.fotos.reverse());
      const response3 = await api.get(`/api/getuservideos/${params.id}`);
      setUserVideos(response3.data.videos.reverse());
    };
    const getNotifications = async () => {
      const response = await api.get(`/api/getnotifications/${params.id}`);
      setNotifications([...response.data.notifications].reverse());
    };
    const visit = async () => {
      await api.get(`/api/visit/${params.id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
    };
    visit();
    findUser();
    getNotifications();
  }, [params, auth]);

  let width = window.innerWidth;

  return (
    <div>
      {width > 500 ? (
        <div className="user">
          <UserNav
            user={user}
            isOwner={isOwner}
            noticeDisplay={noticeDisplay}
            setNoticeDisplay={setNoticeDisplay}
            noticeText={noticeText}
            noticeRef={noticeRef}
          />
          {!user || user.name === "unnamed" ? (
            <Loader ml={"50%"} />
          ) : (
            <div className="user-content">
              <UserLeftSide
                userFriends={userFriends}
                userSubscribes={userSubscribes}
                divideWord={divideWord}
                isOwner={isOwner}
                setUserFriends={setUserFriends}
                setUserSubscribes={setUserSubscribes}
                noticeDisplay={noticeDisplay}
                setNoticeDisplay={setNoticeDisplay}
                setNoticeText={setNoticeText}
                noticeRef={noticeRef}
              />
              <UserCenterSide
                send={send}
                deletePost={deletePost}
                deleteVideo={deleteVideo}
                userPosts={userPosts}
                userVideos={userVideos}
                setUserVideos={setUserVideos}
                divideWord={divideWord}
                getCurrentDate={getCurrentDate}
                params={params}
                setUserPosts={setUserPosts}
                isOwner={isOwner}
              />
              {notificationsDisplay ? (
                <Notifications
                  showNotifications={showNotifications}
                  notifications={notifications}
                  setNotifications={setNotifications}
                  userFriends={userFriends}
                  setUserFriends={setUserFriends}
                  setNoticeDisplay={setNoticeDisplay}
                  setNoticeText={setNoticeText}
                  noticeRef={noticeRef}
                  params={params}
                />
              ) : (
                <UserRightSide
                  getFile2={getFile2}
                  emitOpen2={emitOpen2}
                  fileRef2={fileRef2}
                  imagePreviewUrl2={imagePreviewUrl2}
                  imagePreviewDisplay2={imagePreviewDisplay2}
                  setImagePreviewDisplay2={setImagePreviewDisplay2}
                  setImagePreviewUrl2={setImagePreviewUrl2}
                  sendFoto={sendFoto}
                  userFotos={userFotos}
                  deleteFoto={deleteFoto}
                  params={params}
                  file2={file2}
                  setFile2={setFile2}
                  getCurrentDate={getCurrentDate}
                  setUserFotos={setUserFotos}
                  isOwner={isOwner}
                  showNotifications={showNotifications}
                  notificationRef={notificationRef}
                />
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="user-mobile">
          <Nav
            user={user}
            noticeDisplay={noticeDisplay}
            setNoticeDisplay={setNoticeDisplay}
            noticeText={noticeText}
            noticeRef={noticeRef}
          />
          <Friends
            userFriends={userFriends}
            isOwner={isOwner}
            setUserFriends={setUserFriends}
            setNoticeDisplay={setNoticeDisplay}
            setNoticeText={setNoticeText}
            noticeRef={noticeRef}
          />
          <Actions
            isOwner={isOwner}
            setNoticeDisplay={setNoticeDisplay}
            setNoticeText={setNoticeText}
            noticeRef={noticeRef}
            notificationsDisplay={notificationsDisplay}
            setNotificationsDisplay={setNotificationsDisplay}
          />
          {notificationsDisplay ? (
            <Notifications
              showNotifications={showNotifications}
              notifications={notifications}
              setNotifications={setNotifications}
              userFriends={userFriends}
              setUserFriends={setUserFriends}
              setNoticeDisplay={setNoticeDisplay}
              setNoticeText={setNoticeText}
              noticeRef={noticeRef}
              params={params}
            />
          ) : (
            <></>
          )}
          <Fotos
            userFotos={userFotos}
            setUserFotos={setUserFotos}
            isOwner={isOwner}
            showNotifications={showNotifications}
            getFile2={getFile2}
            emitOpen2={emitOpen2}
            fileRef2={fileRef2}
            file2={file2}
            imagePreviewDisplay2={imagePreviewDisplay2}
            imagePreviewUrl2={imagePreviewUrl2}
          />
          <Videos
            deletePost={deletePost}
            userPosts={userPosts}
            setUserPosts={setUserPosts}
            isOwner={isOwner}
            userVideos={userVideos}
            setUserVideos={setUserVideos}
            deleteVideo={deleteVideo}
          />
        </div>
      )}
    </div>
  );
};

export default User;
