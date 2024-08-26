import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [registeredMedia, setRegisteredMedia] = useState(0);
  const [loadedMediaHeights, setLoadedMediaHeights] = useState([]);
  const [totalMediaHeight, setTotalMediaHeight] = useState(0);

  const registerMedia = useCallback(() => {
    setRegisteredMedia((prev) => prev + 1);
  }, []);

  const loadMedia = useCallback((height) => {
    setLoadedMediaHeights((prev) => [...prev, height]);
  }, []);

  useEffect(() => {
    if (
      registeredMedia === 0 ||
      loadedMediaHeights.length === registeredMedia + 1
    ) {
      setTotalMediaHeight(
        loadedMediaHeights.reduce((acc, currentHeight) => {
          return acc + currentHeight;
        }, 0)
      );
    }
  }, [loadedMediaHeights]);

  useEffect(() => {
    onAllMessagesLoaded(totalMediaHeight);
  }, [totalMediaHeight]);

  return {
    registerMedia,
    loadMedia,
  };
}
