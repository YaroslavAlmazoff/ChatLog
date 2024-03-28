import { useState, useRef, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../auth/api/auth";
import { useParams } from "react-router";
import ImagePreview from "../components/ImagePreview";
import "../../styles/form.css";
import Loader from "../../../common_components/Loader";
import useVerify from "../../../common_hooks/verify.hook";

const EditPage = () => {
  const { verify } = useVerify();
  useEffect(() => {
    verify();
  }, []);
  const auth = useContext(AuthContext);
  const params = useParams();
  const [pubName, setPubName] = useState("");
  const [pubDescription, setPubDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState("");

  const [pub, setPub] = useState({});

  const [avatarOpened, setAvatarOpened] = useState(false);
  const [bannerOpened, setBannerOpened] = useState(false);

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
    setAvatarOpened(true);
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
    setBannerOpened(true);
  };

  const editPublic = async () => {
    if (!pubName) {
      setError("Не введено имя");
    }
    const formData = new FormData();
    formData.append("name", pubName);
    formData.append("description", pubDescription);
    formData.append("avatar", file);
    formData.append("banner", file2);
    const response = await api.post(`/api/public/edit/${params.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.token}`,
      },
    });

    if (!response.data.error) {
      window.location = `/public/${params.id}`;
    } else {
      setError(response.data.error);
    }
  };

  useEffect(() => {
    setLoading(true);
    const getPublic = async () => {
      const response = await api.get(`/api/public/public/${params.id}`);
      console.log(response);
      setPubName(response.data.pub.name);
      setPubDescription(response.data.pub.description);
      setPub(response.data.pub);
      setLoading(false);
    };
    getPublic();
  }, [params]);

  return (
    <div className="create-public">
      {!loading ? (
        <div className="create-public-form">
          <h1 style={{ color: "white" }}>Редактировать группу</h1>
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
            <button onClick={(e) => emitOpen(e)} className="dark-button">
              Выберите аватарку
            </button>
            {avatarOpened ? (
              <ImagePreview imageUrl={imagePreviewUrl1} />
            ) : (
              <>
                {pub.avatarUrl ? (
                  <img
                    width="150"
                    src={
                      process.env.REACT_APP_API_URL +
                      "/publicavatars/" +
                      pub.avatarUrl
                    }
                  />
                ) : null}
              </>
            )}
          </div>
          <div className="create-public-upload-field">
            <button onClick={(e) => emitOpen2(e)} className="dark-button">
              Выберите баннер
            </button>
            {bannerOpened ? (
              <ImagePreview imageUrl={imagePreviewUrl2} />
            ) : (
              <>
                {pub.bannerUrl ? (
                  <img
                    width="150"
                    src={
                      process.env.REACT_APP_API_URL +
                      "/publicbanners/" +
                      pub.bannerUrl
                    }
                  />
                ) : null}
              </>
            )}
          </div>
          <button className="button" onClick={editPublic}>
            Подтвердить изменения
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

export default EditPage;
