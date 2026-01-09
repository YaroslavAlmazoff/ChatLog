import { imageFormats } from "../data/messengerConfiguration";

export default function useImage() {
  const determineImageFormat = (image) => {
    const width = image.naturalWidth;
    const height = image.naturalHeight;

    if (width > height) {
      return imageFormats.horizontal;
    } else if (height > width) {
      return imageFormats.vertical;
    } else {
      return imageFormats.square;
    }
  };
  return { determineImageFormat };
}
