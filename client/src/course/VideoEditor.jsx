function VideoEditor({ video, upload, onChange, onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onUpload(video.id, file);
  };

  return (
    <div className="video-editor">
      <h3>Редактор видео</h3>

      <input
        className="input"
        placeholder="Название видео"
        value={video.title}
        onChange={(e) => onChange({ ...video, title: e.target.value })}
      />

      <input type="file" accept="video/*" onChange={handleFileChange} />

      {upload && (
        <div style={{ marginTop: 8, fontSize: 12 }}>
          Статус: <b>{upload.status}</b>
          {upload.status === "uploading" && (
            <div>
              <progress value={upload.progress} max="100" />
              {upload.progress}%
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default VideoEditor;
