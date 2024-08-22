import { createContext } from "react";

const noop = function () {};

export const ImageLoadContext = createContext({
  registerImage: noop,
  handleImageLoad: noop,
  allImagesLoaded: false,
});
