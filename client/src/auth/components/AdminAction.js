import { useParams } from "react-router";

const AdminAction = () => {
  const params = useParams();
  const isAdmin = params.id === "628e5aab0153706a3e18fe79";
  const gotoAdmin = () => {
    window.location = `/admin`;
  };
  if (isAdmin) {
    return (
      <button className="dark-button user-action-button" onClick={gotoAdmin}>
        Кабинет администратора
      </button>
    );
  } else return null;
};

export default AdminAction;
