import ImagePreview from "./parts/ImagePreview";
import { useState, useRef, useContext, useEffect } from "react";
import api from "./api/auth";
import "./styles/create-post.css";
import "./styles/form.css";
import { smiles } from "../messenger/components/pages/smiles";
import Smile from "../messenger/components/parts/Smile";
import useDate from "../common_hooks/date.hook";
import { AuthContext } from "../context/AuthContext";
import Loader from "../common_components/Loader";
import useVerify from "../common_hooks/verify.hook";

const CreatePost = () => {
  const { verify } = useVerify();

  useEffect(() => {
    verify();
  }, []);

  const auth = useContext(AuthContext);
  const { getCurrentDate } = useDate();
  const [articleTitle, setArticleTitle] = useState("Напишите что-нибудь...");
  const [files, setFiles] = useState([]);
  const [filesData, setFilesData] = useState([]);
  const [imageDisplay, setImageDisplay] = useState("none");
  const [smilesDisplay, setSmilesDisplay] = useState("none");
  const [loading, setLoading] = useState(false);
  //Создание ссылок на файловые поля ввода
  const fileRef = useRef();
  //Получение файла изображения поста пользователя
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
    setLoading(true);
    const currentDate = getCurrentDate();
    let formData = new FormData();
    formData.append("title", articleTitle);
    formData.append("date", currentDate);
    files.forEach((el, index) => {
      formData.append(`file${index}`, el);
    });
    await api.post(`/api/createuserpost`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.token}`,
      },
    });

    setLoading(false);
    window.location = `/user/${auth.userId}`;
  };
  const closeSmiles = () => {
    setSmilesDisplay("none");
  };
  const addSmile = (code) => {
    setArticleTitle((prev) => prev + code);
    closeSmiles();
  };
  const showSmiles = () => {
    console.log(
      smilesDisplay,
      smilesDisplay === "none",
      smilesDisplay === "block"
    );
    if (smilesDisplay === "none") {
      setSmilesDisplay("block");
      setTimeout(() => {
        setSmilesDisplay("none");
      }, 10000);
    } else {
      setSmilesDisplay("none");
    }
    console.log(
      "sesh",
      smilesDisplay,
      smilesDisplay === "none",
      smilesDisplay === "block"
    );
  };

  return (
    <>
      {!loading ? (
        <div className="create-post block">
          <h2 className="form-title">Обновление профиля</h2>
          <input
            onChange={(e) => getFile(e)}
            ref={fileRef}
            type="file"
            accept=".jpg, .png, .gif"
            multiple
          />
          <input
            className="post-field"
            type="text"
            value={articleTitle}
            onChange={(e) => setArticleTitle(e.target.value)}
          />
          <img
            onClick={showSmiles}
            className="upload-image"
            src={require(`../messenger/img/smile.png`)}
            alt="img"
          />
          <button onClick={(e) => emitOpen(e)} className="button">
            Выбрать фото
          </button>
          <button onClick={send} className="button">
            Добавить запись
          </button>

          <div
            className="create-public-images-list"
            style={{ display: imageDisplay }}
          >
            {filesData.map((imageUrl) => (
              <ImagePreview imageUrl={imageUrl} />
            ))}
          </div>
          <div className="room-smiles" style={{ display: smilesDisplay }}>
            {smiles.map((el) => (
              <Smile key={el.code} el={el} addSmile={addSmile} />
            ))}
          </div>
        </div>
      ) : (
        <>
          <p style={{ color: "white" }}>
            Подождите, пока данные отправятся на сервер...
          </p>
          <br />
          <Loader ml={"50%"} />
        </>
      )}
    </>
  );
};

export default CreatePost;
