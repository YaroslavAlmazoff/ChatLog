import { useEffect } from "react";

const useMutationObserver = (ref, callback) => {
  useEffect(() => {
    if (!ref.current) return;

    const observer = new MutationObserver(() => {
      callback();
    });

    observer.observe(ref.current, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [ref, callback]);
};

export default function useScroll() {
  // const loadScroll = (ref, scroll) => {
  //   setTimeout(() => {
  //     const _fc = ref.current.offsetHeight;
  //     ref.current.scrollTop = ref.current.scrollHeight - scroll;
  //   }, 100);
  // };

  const loadScroll = (ref, scroll) => {
    useMutationObserver(ref, () => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight - scroll;
      }
    });
  };

  const scrollToBottom = (ref) => {
    requestAnimationFrame(() => {
      ref.current.scrollTop = ref.current.scrollHeight;
    });
  };

  return { loadScroll, scrollToBottom };
}
