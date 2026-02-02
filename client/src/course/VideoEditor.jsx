function VideoEditor({ video, onChange, onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onUpload(video.id, file);
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

      {/* Загрузка */}
      <div style={{ marginTop: 12 }}>
        <input type="file" accept="video/*" onChange={handleFileChange} />
      </div>

      {video.src && (
        <div style={{ marginTop: 8, fontSize: 12 }}>
          Загружен файл: <b>{video.src}</b>
        </div>
      )}
    </div>
  );
}

export default VideoEditor;
