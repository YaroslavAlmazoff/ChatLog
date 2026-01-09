export const roomTypes = {
  private: "private",
  group: "group",
};

export const roomContentTypes = {
  messages: "messages",
  groupSettings: "groupSettings",
  addMembers: "addMembers",
};

export const limits = {
  images: 6,
  videos: 2,
};

export const sizeLimit = {
  limit: 50,
  unit: "Mb",
};

export const folders = {
  images: "message-images",
  videos: "message-videos",
  audios: "message-audios",
  bg: "room-backgrounds",
  groupAvatars: "chatavatars",
  userAvatars: "useravatars",
};

export const actionsAnimationClasses = {
  show: "room-message-actions-show",
  hide: "room-message-actions-hide",
};

export const messagesDataTypes = {
  init: "init",
  load: "load",
  create: "create",
  delete: "delete",
  edit: "edit",
};

export const imageFormats = {
  horizontal: "horizontal",
  vertical: "vertical",
  square: "square",
};
export const imagesInLine = 2;
export const videosInLine = 2;

export const modalTypes = {
  neutral: "neutral",
  success: "success",
  error: "error",
  image: "image",
  video: "video",
};

export const startMessagesCountCheck = 10;

export const testMessages = [
  {
    message: "Привет",
    user: "628e5aab0153706a3e18fe79",
    name: "Yaroslav Almazoff",
    date: "23.07.2024 12:00",
    avatar: "907d4938-52fa-4c48-a421-6245c7f2d453.jpg",
    images: [
      "37d5055a-aea0-4397-b640-6d06b8d8a497.jpg",
      "3ff98630-d038-4093-878f-69232741e273.jpg",
    ],
    videos: ["video1.mp4", "video2.mp4"],
  },
  {
    message: "Привет",
    user: "628e5aab0153706a3e18fe79",
    name: "Yaroslav Almazoff",
    date: "23.07.2024 12:00",
    avatar: "907d4938-52fa-4c48-a421-6245c7f2d453.jpg",
    images: [
      "37d5055a-aea0-4397-b640-6d06b8d8a497.jpg",
      "3ff98630-d038-4093-878f-69232741e273.jpg",
    ],
    videos: ["video1.mp4", "video2.mp4"],
  },
];
