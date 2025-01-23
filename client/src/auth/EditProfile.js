import React, { useEffect, useState, useRef, useContext } from "react";
import "./styles/form.css";
import "./styles/user.css";
import api from "./api/auth";
import ImagePreviewEdit1 from "./components/ImagePreviewEdit1";
import ImagePreviewEdit2 from "./components/ImagePreviewEdit2";
import { AuthContext } from "../context/AuthContext";
import Loader from "../common_components/Loader";
import useVerify from "../common_hooks/verify.hook";

const EditProfile = () => {
  const auth = useContext(AuthContext);
  const { verify } = useVerify();
  const fileRef = useRef();
  const fileRef2 = useRef();
  const [file, setFile] = useState("");
  const [file2, setFile2] = useState("");
  const [imagePreviewDisplay1, setImagePreviewDisplay1] = useState("none");
  const [imagePreviewUrl1, setImagePreviewUrl1] = useState("");
  const [imagePreviewDisplay2, setImagePreviewDisplay2] = useState("none");
  const [imagePreviewUrl2, setImagePreviewUrl2] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [aboutMe, setAboutMe] = useState("Напишите о себе");
  const [loading, setLoading] = useState(false);
  const emitOpen = () => {
    fileRef.current.click();
  };
  const emitOpen2 = () => {
    fileRef2.current.click();
  };
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
  const getFile2 = async (e) => {
    let file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagePreviewDisplay2("block");
      setImagePreviewUrl2(ev.target.result);
    };
    reader.readAsDataURL(file);
    setFile2(file);
  };
  useEffect(() => {
    verify();
    setLoading(true);
    const getUserData = async () => {
      const response = await api.get(`/api/user-by-token`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const user = response.data.user;
      setName(user.name);
      setSurName(user.surname);
      setAge(user.age);
      setEmail(user.email);
      setAboutMe(user.aboutMe);
      setLoading(false);
    };
    getUserData();
  }, [auth]);
  const updateHandler = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("surname", surname);
    formData.append("age", age);
    formData.append("email", email);
    formData.append("aboutMe", aboutMe);
    formData.append("file", file);
    formData.append("file2", file2);
    await api.post(`/api/editprofile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth.token}`,
      },
    });
    setLoading(false);
    window.location = `/user/${auth.userId}`;
  };
  return (
    <div className="form">
      <h2 className="form-title">Обновление профиля</h2>
      {!loading ? (
        <>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите имя"
            type="text"
            className="form-field"
          />
          <input
            value={surname}
            onChange={(e) => setSurName(e.target.value)}
            placeholder="Введите фамилию"
            type="text"
            className="form-field"
          />
          <p style={{ color: "white" }}>Выберите дату рождения:</p>
          <input
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Выберите дату рождения"
            type="date"
            className="form-field"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите свой email"
            type="email"
            className="form-field"
          />
          <textarea
            maxLength={100}
            className="form-area"
            value={aboutMe}
            onChange={(e) => setAboutMe(e.target.value)}
            placeholder="Напишите о себе..."
          ></textarea>
          <input onChange={(e) => getFile(e)} ref={fileRef} type="file" />
          <button onClick={(e) => emitOpen(e)} className="dark-button submit">
            Добавить аватар
          </button>
          <ImagePreviewEdit1
            imagePreviewUrl1={imagePreviewUrl1}
            imagePreviewDisplay1={imagePreviewDisplay1}
          />
          <input onChange={(e) => getFile2(e)} ref={fileRef2} type="file" />
          <button onClick={(e) => emitOpen2(e)} className="dark-button submit">
            Добавить баннер
          </button>
          <ImagePreviewEdit2
            imagePreviewUrl2={imagePreviewUrl2}
            imagePreviewDisplay2={imagePreviewDisplay2}
          />
          <button onClick={updateHandler} className="button mt ml0">
            Обновить профиль
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

export default EditProfile;
