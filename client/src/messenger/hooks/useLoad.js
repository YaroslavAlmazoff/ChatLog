import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [loadingMessages, setLoadingMessages] = useState([]);
  const [justSentMessageLoaded, setJustSentMessageLoaded] = useState(false);

  const reset = useCallback(() => {
    setLoadingMessages([]);
  }, []);

  useEffect(() => {
    if (getAllMessagesLoaded()) {
      onAllMessagesLoaded();
      reset();
    }
  }, [loadingMessages]);

  const getAllMessagesLoaded = () => {
    console.log("get all messages loaded", loadingMessages);
    if (loadingMessages.length > 0) {
      let allLoaded = true;
      for (let i = 0; i < loadingMessages.length; i++) {
        allLoaded =
          loadingMessages[i].text &&
          loadingMessages[i].image &&
          loadingMessages[i].video;
        console.log(allLoaded);
        if (!allLoaded) {
          return false;
        }
      }
      console.log(allLoaded);
      return allLoaded;
    } else {
      return false;
    }
  };

  const allMessagesLoaded = getAllMessagesLoaded();

  return {
    setJustSentMessageLoaded,
    setLoadingMessages,
    justSentMessageLoaded,
    allMessagesLoaded,
  };
}
