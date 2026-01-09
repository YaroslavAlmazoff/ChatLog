import { limits } from "./messengerConfiguration";

export const filesCountErrors = {
  imagesCount: `Ошибка: Нельзя загружать больше ${limits.images} изображений`,
  videosCount: `Ошибка: Нельзя загружать больше ${limits.videos} видео`,
};

export const fileSendErrors = {
  sizeError: "Общий размер загружаемых файлов превышает 100Mb. ",
  tryToLoadSingleFile: "Попробуйте загрузить файлы по очереди.",
  singleFileError:
    "Загружаемый файл слишком большой. Попробуйте загрузить его в ChatLog Videos и отправить ссылку на него сюда.",
};

export const messengerErrors = {
  sendError:
    "Не удалось отправить сообщение. Возможно, проблема во включенном VPN.",
};
