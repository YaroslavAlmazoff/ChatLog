import { useCallback, useEffect, useState } from "react";

export default function useLoad(onAllMessagesLoaded) {
  const [registered, setRegistered] = useState(0);
  const [loaded, setLoaded] = useState(0);

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
    console.log(registered, loaded);
    if (loaded && registered === loaded) {
      onAllMessagesLoaded();
      reset();
    }
  }, [loaded]);

  return { register, load };
}
