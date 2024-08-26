import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded, getMediaExists) {
  const [registeredMedia, setRegisteredMedia] = useState(0);
  const [loadedMediaHeights, setLoadedMediaHeights] = useState([]);
  const [justSentMediaLoaded, setJustSentMediaLoaded] = useState(false);

  const registerMedia = useCallback(() => {
    setRegisteredMedia((prev) => prev + 1);
  }, []);

  const loadMedia = useCallback((height) => {
    setLoadedMediaHeights((prev) => [...prev, height]);
  }, []);

  useEffect(() => {
    if (
      !getMediaExists() ||
      loadedMediaHeights.length === registeredMedia + 1
    ) {
      onAllMessagesLoaded(
        loadedMediaHeights.reduce((acc, currentHeight) => {
          return acc + currentHeight;
        }, 0)
      );
    }
  }, [loadedMediaHeights]);

  return {
    registerMedia,
    loadMedia,
    setJustSentMediaLoaded,
    justSentMediaLoaded,
  };
}
