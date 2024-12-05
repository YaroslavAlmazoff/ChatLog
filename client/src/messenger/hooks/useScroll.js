export default function useScroll() {
  const loadScroll = (ref, scroll) => {
    setTimeout(() => {
      ref.current.scrollTop = ref.current.scrollHeight - scroll;
    }, 0);
  };

  const scrollToBottom = (ref) => {
    requestAnimationFrame(() => {
      ref.current.scrollTop = ref.current.scrollHeight;
    });
  };

  return { loadScroll, scrollToBottom };
}
