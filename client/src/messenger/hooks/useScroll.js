export default function useScroll() {
  const loadScroll = (ref, scroll) => {
    requestAnimationFrame(() => {
      ref.current.scrollTop = ref.current.scrollHeight - scroll;
    });
  };

  const scrollToBottom = (ref) => {
    ref.current.scrollTop = ref.current.scrollHeight;
  };

  return { loadScroll, scrollToBottom };
}
