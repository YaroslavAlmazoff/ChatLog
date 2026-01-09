import { useEffect, useRef } from "react";

export const useObserver = (ref, canLoad, loading, callback) => {
  const observer = useRef();

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    const cb = function (entries) {
      if (entries[0].isIntersecting && canLoad) {
        callback();
      }
    };
    const options = {
      root: ref.current?.parentElement,
    };
    observer.current = new IntersectionObserver(cb, options);
    observer.current.observe(ref.current);

    return () => {
      if (observer.current) observer.current.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);
};
