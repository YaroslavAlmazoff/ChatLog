import useFile from "./useFile";

export default function useWindow() {
  const { fileFromServer } = useFile();

  const handleLoaded = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  const openInNewTab = (folder, name) => {
    window.open("", "_blank").location.href = fileFromServer(folder, name);
  };

  return { handleLoaded, openInNewTab };
}
