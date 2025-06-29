import { useState, useRef } from "react";
import api from "../auth/api/auth";

const AddImage = () => {
  const [text, setText] = useState("portfolio");
  const [name, setName] = useState("");
  const [file, setFile] = useState("");

  const fileRef = useRef();
  //Получение файла изображения поста пользователя
  const emitOpen2 = () => {
    fileRef.current.click();
  };

  //Получение файла фотографии пользователя
  const getFile2 = async (e) => {
    let file = e.target.files[0];
    console.log(file);
    //Загрузка файла в состояние
    setFile(file);
  };

  const send = async () => {
    const formData = new FormData();
    formData.append("folder", text);
    formData.append("name", name);
    formData.append("file", file);

    setName("");
    setFile("");

    await api.post("/api/upload-something", formData);
  };

  return (
    <div className="form block">
      <span className="color-neon-blue text-glow">Добавление файла</span>
      <input
        className="input"
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Имя папки"
      />
      <input
        className="input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя файла"
      />
      <input onChange={(e) => getFile2(e)} ref={fileRef} type="file" />
      <button onClick={(e) => emitOpen2(e)} className="button">
        Добавить файл
      </button>
      <button className="button" onClick={send}>
        Загрузить
      </button>
    </div>
  );
};

export default AddImage;
