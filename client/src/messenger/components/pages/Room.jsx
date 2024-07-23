import { useState } from "react";
import RoomHead from "../components/RoomHead";
import RoomMessageField from "../components/RoomMessageField";
import RoomMessages from "../components/RoomMessages";
import "../../styles/Room.css";

export default function Room() {
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
      videos: [],
    },
  ]);

  return (
    <div className="block room-size room">
      <RoomHead
        name="Yaroslav Almazoff"
        onlineDate="16.07.2024 18:00"
        isOnline={false}
      />
      <RoomMessages messages={messages} />
      <RoomMessageField />
    </div>
  );
}
