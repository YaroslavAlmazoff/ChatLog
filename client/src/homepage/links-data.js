export const list1 = (userId) => [
  { name: "Моя страница", link: `/user/${userId}` },
  { name: "Сообщения", link: "/messages" },
  { name: "Приложения", link: "/apps" },
  { name: "Люди", link: "/users" },
  { name: "Группы", link: `/publics` },
];

export const list2 = () => [
  { name: "Chat Log Видеоблогер", link: `/videohost` },
  { name: "Chat Log Cloud", link: `/cloud` },
];

export const list3 = (userId) => [
  { name: "Моя страница", link: `/user/${userId}` },
  { name: "Сообщения", link: "/messages" },
  { name: "Игры", link: "/store" },
  { name: "Люди", link: "/users" },
  { name: "Группы", link: `/publics` },
  { name: "Сервисы", link: "/services" },
];
