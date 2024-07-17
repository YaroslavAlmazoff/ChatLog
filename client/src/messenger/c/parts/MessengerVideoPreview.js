import { useEffect, useState } from "react";

const MessengerVideoPreview = ({ videoFile }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData(ev.target.result);
    };
    reader.readAsDataURL(videoFile);
  }, [videoFile]);

  const handleVideoLoad = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <video
      width="200"
      controls
      src={data}
      onLoadedData={handleVideoLoad}
      style={{ marginTop: "15px", borderRadius: "15px" }}
    ></video>
  );
};

export default MessengerVideoPreview;
