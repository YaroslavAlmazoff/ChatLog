import { useRef, useState, useEffect } from "react";

const VideoRunner = ({ video, onProgress }) => {
  const videoRef = useRef(null);

  const [duration, setDuration] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);

  const handleLoadedMetadata = () => {
    setDuration(videoRef.current.duration);
  };

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;

    setMaxWatched((prev) => {
      if (current > prev) return current;
      return prev;
    });
  };

  useEffect(() => {
    if (!duration || !maxWatched) return;

    const percent = Math.min(Math.round((maxWatched / duration) * 100), 100);

    onProgress?.(percent);
  }, [maxWatched, duration]);
  if (!video || !video.src) return null;
  return (
    <div className="lesson-video">
      <video
        ref={videoRef}
        controls
        width="100%"
        src={process.env.REACT_APP_API_URL + "/courses/videos/" + video.src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};

export default VideoRunner;
