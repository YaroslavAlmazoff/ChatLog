import { limits } from "./messengerConfiguration";

export const errors = {
  imagesCount: `Ошибка: Нельзя загружать больше ${limits.images} изображений`,
  videosCount: `Ошибка: Нельзя загружать больше ${limits.videos} видео`,
};
