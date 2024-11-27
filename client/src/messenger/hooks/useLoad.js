import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [loadingMessages, setLoadingMessages] = useState([]);
  const [justSentMessageLoaded, setJustSentMessageLoaded] = useState(false);

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
    if (loadingMessages.length) {
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
    } else false;
  }, []);

  const allMessagesLoaded = !loadingMessages.length || getAllMessagesLoaded();

  return {
    setJustSentMessageLoaded,
    setLoadingMessages,
    justSentMessageLoaded,
    allMessagesLoaded,
  };
}
