import MessengerImagePreview from "../parts/MessengerImagePreview";
import MessengerVideoPreview from "../parts/MessengerVideoPreview";

const Preview = ({ imageFiles, videoFiles }) => {
  return (
    <>
      {imageFiles.length &&
        imageFiles.map((imageFile) => (
          <MessengerImagePreview imageFile={imageFile} />
        ))}
      {videoFiles.length &&
        videoFiles.map((videoFile) => (
          <MessengerVideoPreview videoFile={videoFile} />
        ))}
    </>
  );
};
export default Preview;
