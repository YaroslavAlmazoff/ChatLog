import { useState, useRef } from "react";
import api from "../auth/api/auth";

const AddEvent = () => {
  const [text, setText] = useState("");
  const [year, setYear] = useState("2025");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");
  const [interesting, setInteresting] = useState(false);
  const [file, setFile] = useState("");
  const [file2, setFile2] = useState("");
  const [information, setInformation] = useState("");
  const [visibility, setVisibility] = useState("");
  const [sort, setSort] = useState(null);

  const fileRef = useRef();
  const file2Ref = useRef();
  const emitOpen = () => {
    fileRef.current.click();
  };

  const getFile = async (e) => {
    let file = e.target.files[0];
    setFile(file);
  };

  const emitOpen2 = () => {
    file2Ref.current.click();
  };

  const getFile2 = async (e) => {
    let file = e.target.files[0];
    setFile2(file);
  };

  const send = async () => {
    const formData = new FormData();
    formData.append("text", text);
    formData.append("month", month);
    formData.append("day", day);
    formData.append("time", time);
    formData.append("interesting", interesting);
    formData.append("file", file);
    formData.append("file2", file2);
    formData.append("information", information);
    formData.append("visibility", visibility);
    formData.append("year", year);

    setText("");
    setDay("");
    setTime("");
    setMonth("");
    setYear("2026");
    setInteresting(false);
    setFile("");
    setFile2("");
    setInformation("");
    setVisibility("");
    setSort(null);

    await api.post("/api/aep/new-event", formData);
    window.location.reload();
  };

  const styles = {
    marginTop: "10px",
  };

  return (
    <div className="form block">
      <span className="color-neon-blue text-glow">
        Добавление астрономических событий
      </span>
      <input
        className="input"
        style={styles}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Событие"
      />
      <input
        className="input"
        style={styles}
        type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
        placeholder="Год"
      />
      <input
        className="input"
        style={styles}
        type="text"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
        placeholder="Месяц"
      />
      <input
        className="input"
        style={styles}
        type="text"
        value={day}
        onChange={(e) => setDay(e.target.value)}
        placeholder="День"
      />
      <input
        className="input"
        style={styles}
        type="text"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        placeholder="Время"
      />
      <input
        className="input"
        style={styles}
        type="text"
        value={information}
        onChange={(e) => setInformation(e.target.value)}
        placeholder="Информация"
      />
      <input
        className="input"
        style={styles}
        type="text"
        value={visibility}
        onChange={(e) => setVisibility(e.target.value)}
        placeholder="Видимость"
      />
      <input
        type="checkbox"
        style={styles}
        value={interesting}
        onChange={(e) => setInteresting(e.isTrusted)}
      />
      <span className="text-glow" style={{ color: "white" }}>
        Интересное
      </span>
      <input
        className="input"
        type="number"
        style={styles}
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        placeholder="Сортировка"
      />
      <input
        style={styles}
        onChange={(e) => getFile(e)}
        ref={fileRef}
        type="file"
      />
      <input
        style={styles}
        onChange={(e) => getFile2(e)}
        ref={file2Ref}
        type="file"
      />
      <button style={styles} onClick={(e) => emitOpen(e)} className="button">
        Preview
      </button>
      <button style={styles} onClick={(e) => emitOpen2(e)} className="button">
        Screenshot
      </button>
      <button style={styles} className="button" onClick={send}>
        Send
      </button>
    </div>
  );
};

export default AddEvent;
