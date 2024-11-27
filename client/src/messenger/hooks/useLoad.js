import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [registeredMedia, setRegisteredMedia] = useState(0);
  const [loadedMediaHeights, setLoadedMediaHeights] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  const [justSentMediaLoaded, setJustSentMediaLoaded] = useState(false);

  const registerMedia = useCallback(() => {
    setRegisteredMedia((prev) => prev + 1);
  }, []);

  const loadMedia = useCallback((height) => {
    setLoadedMediaHeights((prev) => [...prev, height]);
    setLoadingMedia((prev) => !prev);
  }, []);

  const reset = useCallback(() => {
    setRegisteredMedia(0);
    setLoadedMediaHeights([]);
  }, []);

  useEffect(() => {
    if (!registeredMedia || loadedMediaHeights.length === registeredMedia) {
      onAllMessagesLoaded(
        loadedMediaHeights.reduce((acc, currentHeight) => {
          return acc + currentHeight;
        }, 0)
      );
      reset();
    }
  }, [loadingMedia]);

  const allMediaLoaded =
    registeredMedia === 0 || loadedMediaHeights.length === registeredMedia;

  return {
    registerMedia,
    loadMedia,
    setJustSentMediaLoaded,
    justSentMediaLoaded,
    allMediaLoaded,
  };
}
