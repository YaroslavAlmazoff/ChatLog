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

  return { getMediaExists };
}
