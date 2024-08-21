import { useRef } from "react";

export default function useAudio(audio) {
  const audioRef = useRef(new Audio(audio));

  const playAudio = () => {
    audioRef.current.play();
  };

  const stopAudio = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  return { playAudio, stopAudio };
}
