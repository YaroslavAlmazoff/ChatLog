import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [registeredMedia, setRegisteredMedia] = useState(0);
  const [loadedMediaHeights, setLoadedMediaHeights] = useState([]);
  const [totalMediaHeight, setTotalMediaHeight] = useState(0);

  const registerMedia = useCallback(() => {
    setRegisteredMedia((prev) => prev + 1);
  }, []);

  const loadMedia = useCallback((height) => {
    console.log("loading ");
    setLoadedMediaHeights((prev) => [...prev, height]);
  }, []);

  useEffect(() => {
    if (
      registeredMedia === 0 ||
      loadedMediaHeights.length === registeredMedia + 1
    ) {
      const sum = loadedMediaHeights.reduce((acc, currentHeight) => {
        return acc + currentHeight;
      }, 0);
      console.log(sum);
      setTotalMediaHeight(sum);
    }
  }, [loadedMediaHeights]);

  useEffect(() => {
    console.log("total media height use effect");
    onAllMessagesLoaded(totalMediaHeight);
  }, [totalMediaHeight]);

  return {
    registerMedia,
    loadMedia,
  };
}
