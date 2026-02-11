import { useRef, useState, useEffect } from "react";

const VideoRunner = ({ video, onProgress, savedPercent = 0 }) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);

  // Инициализация из сохранённого
  useEffect(() => {
    if (duration && savedPercent) {
      const seconds = (savedPercent / 100) * duration;
      setMaxWatched(seconds);
    }
  }, [duration]);

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;

    setMaxWatched((prev) => (current > prev ? current : prev));
  };

  useEffect(() => {
    if (!duration) return;

    const percent = Math.min(Math.round((maxWatched / duration) * 100), 100);

    onProgress?.(percent);
  }, [maxWatched, duration]);

  if (!video?.src) return null;

  return (
    <video
      ref={videoRef}
      controls
      width="100%"
      src={process.env.REACT_APP_API_URL + "/courses/videos/" + video.src}
      onLoadedMetadata={() => setDuration(videoRef.current.duration)}
      onTimeUpdate={handleTimeUpdate}
    />
  );
};

export default VideoRunner;
