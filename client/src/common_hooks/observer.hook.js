import { useEffect, useRef } from "react";

export const useObserver = (ref, canLoad, isLoading, callback, root) => {
  const observer = useRef();

  useEffect(() => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();

    var cb = function (entries, observer) {
      if (entries[0].isIntersecting && canLoad) {
        callback();
      }
    };
    const options = {
      root: root.current,
    };
    observer.current = new IntersectionObserver(cb, options);
    observer.current.observe(ref.current);
  }, [isLoading]);
};
