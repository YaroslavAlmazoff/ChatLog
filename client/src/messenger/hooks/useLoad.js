import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [registered, setRegistered] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [justSentMessageLoaded, setJustSentMessageLoaded] = useState(false);

  const register = useCallback(() => {
    setRegistered((prev) => prev + 1);
  }, []);

  const load = useCallback(() => {
    setLoaded((prev) => prev + 1);
  }, []);

  const reset = useCallback(() => {
    setRegistered(0);
    setLoaded(0);
  }, []);

  useEffect(() => {
    console.log(loaded, registered);
    if (registered > 0 || registered === loaded) {
      onAllMessagesLoaded();
      reset();
    }
  }, [loaded, registered]);

  const allLoaded = !loaded || registered === loaded;

  return {
    register,
    load,
    setJustSentMessageLoaded,
    justSentMessageLoaded,
    allLoaded,
  };
}
