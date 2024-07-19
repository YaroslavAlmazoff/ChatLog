export default function useWindow() {
  const handleLoaded = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  return { handleLoaded };
}
