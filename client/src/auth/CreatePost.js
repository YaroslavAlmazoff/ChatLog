import { useState, useRef, useContext, useEffect } from "react";
import api from "./api/auth";
import "./styles/create-post.css";
import "./styles/form.css";
import { smiles } from "./smiles";
import Smile from "./Smile";
import useDate from "../common_hooks/date.hook";
import { AuthContext } from "../context/AuthContext";
import ImagePreview from "../common_components/ImagePreview";
import Loader from "../common_components/Loader";
import useVerify from "../common_hooks/verify.hook";
import smileImage from "./img/smile.png";

const CreatePost = ({ setPosts, setOffset, onClose }) => {
  const { verify } = useVerify();

  useEffect(() => {
    verify();
  }, []);

  const auth = useContext(AuthContext);
  const { getCurrentDate } = useDate();
  const [articleTitle, setArticleTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [imagesDisplaying, setImagesDisplaying] = useState(false);
  const [smilesDisplaying, setSmilesDisplaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileRef = useRef();
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
      reader.onload = (ev) => {
        setFilesData((prev) => [...prev, { url: ev.target.result, file: el }]);
        setImagesDisplaying(true);
      };
      reader.readAsDataURL(el);
    });
    setFiles((prev) => [...prev, ...files]);
  };
  const send = async () => {
    setLoading(true);
    const currentDate = getCurrentDate();
    let formData = new FormData();
    formData.append("title", articleTitle);
    formData.append("date", currentDate);
    files.forEach((el, index) => {
      formData.append(`file${index}`, el);
    });
    const response = await api.post(`/api/createuserpost`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.token}`,
      },
    });

    setLoading(false);
    setOffset((prev) => prev + 1);
    setArticleTitle("");
    onClose();
    setPosts((prev) => [response.data.post, ...prev]);
  };
  const closeSmiles = () => {
    setSmilesDisplaying(false);
  };
  const addSmile = (code) => {
    setArticleTitle((prev) => prev + code);
    closeSmiles();
  };
  const showSmiles = () => {
    if (!smilesDisplaying) {
      setSmilesDisplaying(true);
      setTimeout(() => {
        setSmilesDisplaying(false);
      }, 10000);
    } else {
      setSmilesDisplaying(false);
    }
  };

  const onImageDelete = (targetFileData) => {
    const dataIndex = filesData.findIndex(
      (fileData) =>
        fileData.file === targetFileData.file &&
        fileData.url === targetFileData.url
    );
    if (dataIndex !== -1) {
      setFilesData((prev) => prev.filter((_, index) => index !== dataIndex));
      const fileIndex = files.findIndex((file) => file === targetFileData.file);
      if (fileIndex !== -1) {
        setFiles((prev) => prev.filter((_, index) => index !== fileIndex));
      }
    }
  };

  return (
    <>
      {loading ? (
        <>
          <p style={{ color: "white" }}>
            Подождите, пока данные отправятся на сервер...
          </p>
          <br />
          <Loader ml={"50%"} />
        </>
      ) : (
        <>
          <h2 className="form-title">Создание поста</h2>
          <input
            onChange={(e) => getFile(e)}
            ref={fileRef}
            type="file"
            accept=".jpg, .png, .gif"
            multiple
          />
          <input
            className="input"
            type="text"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
            placeholder="Напишите текст здесь"
          />
          <img
            onClick={showSmiles}
            className="new-smile"
            src={smileImage}
            alt="img"
          />
          <button onClick={(e) => emitOpen(e)} className="dark-button ml">
            Выбрать фото
          </button>
          <button onClick={send} className="button ml">
            Опубликовать
          </button>
          {imagesDisplaying ? (
            <div className="create-post-images-list">
              {filesData.map((fileData) => (
                <ImagePreview
                  isDisplaying={true}
                  data={fileData}
                  onDelete={onImageDelete}
                />
              ))}
            </div>
          ) : (
            <></>
          )}
          {smilesDisplaying ? (
            <div className="room-smiles">
              {smiles.map((el) => (
                <Smile key={el.code} el={el} addSmile={addSmile} />
              ))}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default CreatePost;
