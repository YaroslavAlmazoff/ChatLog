import { useCallback, useState } from "react";

export default function useLoad() {
  const [totalMedia, setTotalMedia] = useState(0);
  const [loadedMedia, setLoadedMedia] = useState(0);

  const registerMedia = useCallback(() => {
    console.log("Media registered");
    setTotalMedia((prevTotal) => prevTotal + 1);
  }, []);

  const handleMediaLoad = useCallback(() => {
    console.log("Media loaded");
    setLoadedMedia((prevLoaded) => prevLoaded + 1);
  }, []);

  const allMediaLoaded = totalMedia === 0 || loadedMedia === totalMedia;
  return { allMediaLoaded, registerMedia, handleMediaLoad };
}
