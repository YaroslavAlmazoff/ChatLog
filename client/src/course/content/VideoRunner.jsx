import { useState, useEffect, forwardRef, useImperativeHandle } from "react";

const VideoRunner = forwardRef(({ video, onProgress }, ref) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);

  useEffect(() => {
    if (!duration) return;
    if (!ref.current) return;
    if (maxWatched === 0) return;

    const percent = Math.min(Math.round((maxWatched / duration) * 100), 100);

    onProgress?.(percent);
  }, [maxWatched]);
  const handleTimeUpdate = () => {
    const current = ref.current.currentTime;

    setMaxWatched((prev) => (current > prev ? current : prev));
  };

  useEffect(() => {
    if (!duration) return;

    const percent = Math.min(Math.round((maxWatched / duration) * 100), 100);

    onProgress?.(percent);
  }, [maxWatched, duration]);

  useImperativeHandle(ref, () => ({
    seekTo(seconds) {
      if (!videoRef.current) return;

      videoRef.current.currentTime = seconds;
      videoRef.current.play();
    },
  }));

  if (!video?.src) return null;

  return (
    <video
      ref={videoRef}
      controls
      width="100%"
      src={process.env.REACT_APP_API_URL + "/courses/videos/" + video.src}
      onLoadedMetadata={() => setDuration(ref.current.duration)}
      onTimeUpdate={handleTimeUpdate}
    />
  );
});

export default VideoRunner;
