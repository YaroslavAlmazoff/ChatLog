import { limits } from "./messengerConfiguration";

export const errors = {
  imagesCount: `Не загружайте больше ${limits.images} изображений`,
  videosCount: `Не загружайте больше ${limits.videos} видео`,
};
