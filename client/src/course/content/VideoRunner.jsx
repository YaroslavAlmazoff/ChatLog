import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from "react";

const VideoRunner = forwardRef(({ video, onProgress, onReady }, ref) => {
  const videoRef = useRef(null);
  const [duration, setDuration] = useState(0);
  const [maxWatched, setMaxWatched] = useState(0);

  const BLOCK_SIZE = 10; // секунд

  const handleTimeUpdate = () => {
    const current = videoRef.current.currentTime;

    setMaxWatched((prev) => (current > prev ? current : prev));
  };

  useEffect(() => {
    if (!duration) return;

    const watchedBlocks = Math.floor(maxWatched / BLOCK_SIZE);
    const totalBlocks = Math.ceil(duration / BLOCK_SIZE);

    onProgress?.({
      watchedBlocks,
      totalBlocks,
    });
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
      onLoadedMetadata={() => {
        setDuration(videoRef.current.duration);
        onReady?.(); // 🔥 сигнал родителю
      }}
      onTimeUpdate={handleTimeUpdate}
    />
  );
});

export default VideoRunner;
