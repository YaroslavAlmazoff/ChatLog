import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";
import RoomMessages from "../components/RoomMessages";
import useAPI from "../../hooks/useAPI";
import useFile from "../../hooks/useFile";
import { AuthContext } from "../../../context/AuthContext";
import "../../styles/Room.css";

export default function Room() {
  const { id } = useParams();
  const { getRoom } = useAPI();
  const { fileFromServer } = useFile();
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const [room, setRoom] = useState({
    name: "",
    date: "",
    bg: "",
  });
  const [messages, setMessages] = useState([
    {
      message: "Привет",
      user: "628e5aab0153706a3e18fe79",
      name: "Yaroslav Almazoff",
      date: "23.07.2024 12:00",
      avatar: "907d4938-52fa-4c48-a421-6245c7f2d453.jpg",
      images: [
        "37d5055a-aea0-4397-b640-6d06b8d8a497.jpg",
        "3ff98630-d038-4093-878f-69232741e273.jpg",
      ],
      videos: ["video1.mp4", "video2.mp4"],
    },
    {
      message: "Привет",
      user: "628e5aab0153706a3e18fe79",
      name: "Yaroslav Almazoff",
      date: "23.07.2024 12:00",
      avatar: "907d4938-52fa-4c48-a421-6245c7f2d453.jpg",
      images: [
        "37d5055a-aea0-4397-b640-6d06b8d8a497.jpg",
        "3ff98630-d038-4093-878f-69232741e273.jpg",
      ],
      videos: ["video1.mp4", "video2.mp4"],
    },
  ]);

  useEffect(() => {
    console.log(auth);
    const getData = async () => {
      //const { token } = await verify();
      const { room } = await getRoom(id);
      console.log(room);
      setRoom(room);
    };
    getData();
    console.log(auth);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="block room-size room"
      style={{
        backgroundImage: room.bg ? `url(${fileFromServer(room.bg)})` : "",
      }}
    >
      {/* <RoomHead
        name={room.name}
        onlineDate={room.date}
        isOnline={room.isOnline}
      /> */}
      <RoomMessages messages={messages} />
      {/* <RoomMessageField /> */}
    </div>
  );
}
