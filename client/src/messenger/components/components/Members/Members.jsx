import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../../auth/api/auth";
import FullMemberItem from "./FullMemberItem";

const Members = ({ room, openAddMembers }) => {
  const params = useParams();
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const getMembers = async () => {
      const response = await api.get(`/api/full-members/${params.id}`);
      setMembers(response.data.members);
    };
    getMembers();
  }, []);

  return (
    <div>
      <button
        className="button"
        style={{ pading: "8px" }}
        onClick={openAddMembers}
      >
        Добавить участников
      </button>
      {members.map((el) => (
        <FullMemberItem
          room={room}
          name={el.name}
          surname={el.surname}
          avatarUrl={el.avatarUrl}
          id={el._id}
        />
      ))}
    </div>
  );
};

export default Members;
