import { useParams } from "react-router";

const CreatePostAction = ({ setShowModal }) => {
  const startCreatingPost = () => {
    setShowModal(true);
  };
  return (
    <button
      className="button margin-top-bottom center-side-button"
      onClick={startCreatingPost}
    >
      Создать новый пост
    </button>
  );
};

export default CreatePostAction;
