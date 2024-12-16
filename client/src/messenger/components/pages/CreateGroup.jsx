import { useContext, useRef, useState } from "react";
import api from "../../../auth/api/auth";
import useWord from "../../../common_hooks/divideWord.hook";
import { AuthContext } from "../../../context/AuthContext";
import "../../styles/CreateGroup.css";
import "../../../auth/styles/form.css";

export function CreateGroup() {
  const { divideWord } = useWord();
  const auth = useContext(AuthContext);
  const fileRef = useRef(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState({});
  const [filename, setFilename] = useState("Выберите аватарку");
  const emitOpen = () => {
    fileRef.current.click();
  };
  const getFile = async (e) => {
    let file = e.target.files[0];
    setFilename(divideWord(file.name, 8));
    setFile(file);
  };
  const create = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("file", file);

    await api.post("/api/create-room", formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    window.location = "/messages";
  };

  return (
    <div className="create-chat block">
      <h1>Создание беседы</h1>
      <input onChange={(e) => getFile(e)} ref={fileRef} type="file" />
      <button onClick={(e) => emitOpen(e)} className="dark-button">
        {filename}
      </button>
      <input
        className="form-field"
        style={{ width: "60%" }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Введите название"
      />
      <button className="button mt" onClick={create}>
        Создать
      </button>
    </div>
  );
}
