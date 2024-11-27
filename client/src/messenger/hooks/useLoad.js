import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [loadingMessages, setLoadingMessages] = useState([]);
  const [justSentMessageLoaded, setJustSentMessageLoaded] = useState(false);

  const loadMessage = useCallback((message) => {
    setLoadingMedia((prev) => [...prev, message]);
  }, []);

  const reset = useCallback(() => {
    setLoadingMessages([]);
  }, []);

  useEffect(() => {
    if (!loadingMessages.length || getAllMessagesLoaded()) {
      onAllMessagesLoaded();
      reset();
    }
  }, [loadingMessages]);

  const getAllMessagesLoaded = useCallback(() => {
    let allLoaded = true;
    for (let i = 0; i < loadingMessages.length; i++) {
      allLoaded =
        loadingMessages[i].text &&
        loadingMessages[i].image &&
        loadingMessages[i].video;
      if (!allLoaded) {
        return allLoaded;
      }
    }
    return allLoaded;
  }, []);

  const allMessagesLoaded = !loadingMessages.length || getAllMessagesLoaded();

  return {
    loadMessage,
    setJustSentMessageLoaded,
    setLoadingMessages,
    justSentMessageLoaded,
    allMessagesLoaded,
  };
}
