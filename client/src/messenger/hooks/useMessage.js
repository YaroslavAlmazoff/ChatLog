export default function useMessage() {
  const getMediaExists = (messages) => {
    let exists = false;
    messages.forEach((message) => {
      if (message.images.length && message.videos.length) {
        exists = true;
      }
    });
    return exists;
  };
  const filterMessages = (messages, newMessages) => {
    return messages.filter(
      (message) =>
        message.date !== newMessages[0].date &&
        message.message !== newMessages[0].message &&
        (message.images[0] !== newMessages[0].images[0] ||
          !message.images.length) &&
        (message.videos[0] !== newMessages[0].videos[0] ||
          !message.videos.length)
    );
  };
  const compareMessages = (
    messages,
    newMessages,
    oldText,
    firstOldImage,
    firstOldVideo
  ) => {
    console.log(newMessages[0].images.length || newMessages[0].videos.length);
    return messages.map((message) => {
      if (
        message.date === newMessages[0].date &&
        message.message === oldText &&
        message.images[0] === firstOldImage &&
        message.videos[0] === firstOldVideo
      ) {
        console.log(
          "COMPARE",
          message,
          newMessages[0].images.length > 0 || newMessages[0].videos.length > 0
        );
        return {
          ...message,
          message: newMessages[0].message,
          images: newMessages[0].images,
          videos: newMessages[0].videos,
          isNew:
            newMessages[0].images.length > 0 ||
            newMessages[0].videos.length > 0,
        };
      } else {
        return message;
      }
    });
  };
  return { getMediaExists, filterMessages, compareMessages };
}
