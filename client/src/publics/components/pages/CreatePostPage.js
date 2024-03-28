import { useRef, useState, useEffect, useContext } from "react";
import useDate from "../../../common_hooks/date.hook";
import ImagePreview from "../components/ImagePreview";
import api from "../../../auth/api/auth";
import { useParams } from "react-router";
import "../../styles/form.css";
import Loader from "../../../common_components/Loader";
import useVerify from "../../../common_hooks/verify.hook";
import { AuthContext } from "../../../context/AuthContext";

const CreatePostPage = () => {
  const { verify } = useVerify();
  const auth = useContext(AuthContext);
  useEffect(() => {
    verify();
  }, []);
  const params = useParams();
  const { getCurrentDate } = useDate();
  const fileRef = useRef();
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [imageDisplay, setImageDisplay] = useState("none");
  const [loading, setLoading] = useState(false);

  const emitOpen = () => {
    fileRef.current.click();
  };
  const getFile = async (e) => {
    let fileList = e.target.files;
    if (fileList.length > 5) {
      alert(
        "Слишком много загружаемых файлов. Попробуйте выбрать меньше пяти файлов."
      );
      return;
    }
    const files = Array.from(fileList);
    files.forEach((el) => {
      const reader = new FileReader();
      console.log(el);
      reader.onload = (ev) => {
        setFilesData((prev) => [...prev, ev.target.result]);
        setImageDisplay("block");
      };
      reader.readAsDataURL(el);
    });
    setFiles(files);
  };

  const send = async () => {
    if (!filesData.length) return;
    setLoading(true);
    const date = getCurrentDate();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("text", text);
    formData.append("date", date);
    files.forEach((el, index) => {
      formData.append(`file${index}`, el);
    });

    await api.post(`/api/public/createpost/${params.id}`, formData, {
      headers: { Authorization: `Bearer ${auth.token}` },
    });
    setLoading(false);
    window.location = `/public/${params.id}`;
  };

  return (
    <div className="create-public-form block">
      {!loading ? (
        <>
          <h1 className="create-public-title">Создание статьи</h1>
          <input
            className="create-public-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Название статьи"
          />
          <textarea
            className="create-public-area"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ваша статья"
          ></textarea>
          <input
            multiple
            onChange={(e) => getFile(e)}
            type="file"
            ref={fileRef}
          />
          <button onClick={(e) => emitOpen(e)} className="dark-button">
            Загрузить изображения
          </button>
          <div
            className="create-public-images-list"
            style={{ display: imageDisplay }}
          >
            {filesData.map((imageUrl) => (
              <ImagePreview imageUrl={imageUrl} />
            ))}
          </div>
          <button
            onClick={send}
            className="button"
            style={{ marginLeft: "10px" }}
          >
            Опубликовать
          </button>
        </>
      ) : (
        <>
          <p style={{ color: "white" }}>
            Подождите, пока данные отправятся на сервер...
          </p>
          <br />
          <Loader ml={"50%"} />
        </>
      )}
    </div>
  );
};

export default CreatePostPage;
