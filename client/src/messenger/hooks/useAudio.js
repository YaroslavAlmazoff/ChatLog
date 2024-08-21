import { useCallback, useRef } from "react";

export default function useAudio(audio) {
  const audioRef = useRef(new Audio(audio));

  const playAudio = useCallback(() => {
    audioRef.current.play();
  }, []);

  const stopAudio = useCallback(() => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  }, []);

  return { playAudio, stopAudio };
}
