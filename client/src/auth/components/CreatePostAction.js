import { useParams } from "react-router";

const CreatePostAction = ({ setShowModal }) => {
  const startCreatingPost = () => {
    setShowModal(true);
  };
  return (
    <button className="button" onClick={startCreatingPost}>
      Создать новый пост
    </button>
  );
};

export default CreatePostAction;
