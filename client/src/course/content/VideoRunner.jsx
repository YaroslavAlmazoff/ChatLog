import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

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
    async seekTo(seconds) {
      if (!videoRef.current) return;

      const video = videoRef.current;

      video.currentTime = seconds;

      try {
        if (!document.fullscreenElement) {
          await video.requestFullscreen();
        }
      } catch (e) {
        console.warn("Fullscreen не разрешён", e);
      }

      video.play();
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
