export default function useScroll() {
  const loadScroll = (ref, scroll) => {
    setTimeout(() => {
      const _fc = ref.current.offsetHeight;
      ref.current.scrollTop = ref.current.scrollHeight - scroll;
    }, 100);
  };

  const scrollToBottom = (ref) => {
    requestAnimationFrame(() => {
      ref.current.scrollTop = ref.current.scrollHeight;
    });
  };

  return { loadScroll, scrollToBottom };
}
