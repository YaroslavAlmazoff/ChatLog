export default function useFile() {
  const fileTypes = {
    images: "images",
    videos: "videos",
  };

  const readFile = (event) => {
    const resultFiles = [];
    Array.from(event.target.files).forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resultFiles.push({
          file: event.target.file[index],
          url: e.target.result,
        });
      };
      reader.readAsDataURL(file);
    });
    return resultFiles;
  };

  return { readFile, fileTypes };
}
