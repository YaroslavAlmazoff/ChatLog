import { useEffect, useState } from "react";

const MessengerImagePreview = ({ imageFile }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData(ev.target.result);
    };
    reader.readAsDataURL(imageFile);
  }, [imageFile]);

  const handleImageLoad = () => {
    window.scrollTo(0, document.body.scrollHeight);
  };

  return (
    <img
      src={data}
      alt="uploaded_image"
      style={{ width: "200px", borderRadius: "15px", marginTop: "15px" }}
      onLoadedData={handleImageLoad}
    />
  );
};

export default MessengerImagePreview;
