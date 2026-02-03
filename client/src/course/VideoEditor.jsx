import { useRef, useState } from "react";

function VideoEditor({ video, onChange, onUpload }) {
  const fileInputRef = useRef(null);

  const [readProgress, setReadProgress] = useState(0);
  const [isReading, setIsReading] = useState(false);

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    setIsReading(true);
    setReadProgress(0);

    reader.onprogress = (event) => {
      if (!event.lengthComputable) return;
      const percent = Math.round((event.loaded / event.total) * 100);
      setReadProgress(percent);
    };

    reader.onloadend = () => {
      setIsReading(false);
      setReadProgress(100);

      // передаём файл наверх
      onUpload(video.id, file);

      // если src ещё не задан — задаём
      if (!video.src) {
        onChange({
          ...video,
          src: `${video.id}.mp4`,
        });
      }
    };

    reader.onerror = () => {
      alert("Ошибка при чтении файла");
      setIsReading(false);
      setReadProgress(0);
    };

    // запускаем чтение
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="video-editor">
      <h3>Редактор видео</h3>

      {/* Название */}
      <input
        className="input"
        placeholder="Название видео"
        value={video.title}
        onChange={(e) =>
          onChange({
            ...video,
            title: e.target.value,
          })
        }
      />

      {/* Скрытый input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Кнопка */}
      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          className="course-editor-add-button"
          onClick={openFileDialog}
          disabled={isReading}
        >
          {video.src ? "🔁 Перезагрузить видео" : "📂 Загрузить видео"}
        </button>
      </div>

      {/* Прогресс чтения */}
      {isReading && (
        <div style={{ marginTop: 10 }}>
          <div style={{ fontSize: 12, marginBottom: 4 }}>
            Чтение файла: {readProgress}%
          </div>
          <progress value={readProgress} max="100" style={{ width: "100%" }} />
        </div>
      )}

      {/* Информация */}
      {video.src && !isReading && (
        <div style={{ marginTop: 8, fontSize: 13 }}>
          📎 Файл: <b>{video.src}</b>
        </div>
      )}
    </div>
  );
}

export default VideoEditor;
