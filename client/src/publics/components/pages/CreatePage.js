import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../auth/api/auth";
import "../../styles/form.css";
import ImagePreview from "../components/ImagePreview";
import Loader from "../../../common_components/Loader";
import useVerify from "../../../common_hooks/verify.hook";

const CreatePage = () => {
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);
  const auth = useContext(AuthContext);
  const [pubName, setPubName] = useState("");
  const [pubDescription, setPubDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //Получение ссылок на файловые поля ввода
  const fileRef = useRef();
  const fileRef2 = useRef();
  //Инициализация состояния для изображений предпросмотра аватарки и баннера
  const [file, setFile] = useState("");
  const [file2, setFile2] = useState("");
  //Инициализация состояний дисплея и url изображений предпросмотра аватарки и баннера
  const [imagePreviewDisplay1, setImagePreviewDisplay1] = useState("none");
  const [imagePreviewUrl1, setImagePreviewUrl1] = useState("");
  const [imagePreviewDisplay2, setImagePreviewDisplay2] = useState("none");
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState("");

  //Эмитирование открытия загрузки изображения для аватарки
  const emitOpen = () => {
    fileRef.current.click();
  };
  //Эмитирование открытия загрузки изображения для баннера
  const emitOpen2 = () => {
    fileRef2.current.click();
  };
  //Получение изображения для аватарки
  const getFile = async (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreviewDisplay1("block");
      setImagePreviewUrl1(ev.target.result);
    };
    reader.readAsDataURL(file);
    setFile(file);
  };
  //Получение изображения для баннера
  const getFile2 = async (e) => {
    let file = e.target.files[0];
    console.log(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreviewDisplay2("block");
      setImagePreviewUrl2(ev.target.result);
    };
    reader.readAsDataURL(file);
    setFile2(file);
  };

  const createPublic = async () => {
    setLoading(true);
    //Инициализация formdata для загрузки на сервер изображений
    const formData = new FormData();
    //Добавление информацию о пользователе в formdata
    formData.append("name", pubName);
    formData.append("description", pubDescription);
    formData.append("avatar", file);
    formData.append("banner", file2);
    //Отправка запроса на обновление профиля
    const response = await api.post(`/api/public/create`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setLoading(false);
    if (!response.data.error) {
      window.location = `/publics`;
    } else {
      setError(response.data.error);
    }
  };

  return (
    <div className="create-public">
      {!loading ? (
        <div className="create-public-form block">
          <h1 style={{ color: "white" }}>Создать группу</h1>
          <input
            className="create-public-input"
            type="text"
            value={pubName}
            onChange={(e) => setPubName(e.target.value)}
            placeholder="Введите название группы"
          />
          <textarea
            className="create-public-area"
            value={pubDescription}
            onChange={(e) => setPubDescription(e.target.value)}
            placeholder="Введите описание"
          ></textarea>
          <input onChange={(e) => getFile(e)} ref={fileRef} type="file" />
          <input onChange={(e) => getFile2(e)} ref={fileRef2} type="file" />
          <div className="create-public-upload-field">
            <button
              onClick={(e) => emitOpen(e)}
              className="dark-button"
              style={{ width: "100%" }}
            >
              Выберите аватарку
            </button>
            <ImagePreview
              imageUrl={imagePreviewUrl1}
              imageDisplay={imagePreviewDisplay1}
            />
          </div>
          <div className="create-public-upload-field">
            <button
              onClick={(e) => emitOpen2(e)}
              className="dark-button"
              style={{ width: "100%" }}
            >
              Выберите баннер
            </button>
            <ImagePreview
              imageUrl={imagePreviewUrl2}
              imageDisplay={imagePreviewDisplay2}
            />
          </div>
          <button className="button" onClick={createPublic}>
            Создать группу
          </button>
          <p style={{ color: "red" }}>{error}</p>
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
    </div>
  );
};

export default CreatePage;
