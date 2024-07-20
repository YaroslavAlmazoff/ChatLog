export default function useFile() {
  const fileTypes = {
    images: "images",
    videos: "videos",
  };

  const readFile = (event) => {
    return new Promise((resolve) => {
      const resultFiles = [];
      const files = Array.from(event.target.files);
      let filesRead = 0;

      files.forEach((file, index) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resultFiles.push({
            file: file,
            url: e.target.result,
          });

          filesRead += 1;
          if (filesRead === files.length) {
            resolve(resultFiles);
          }
        };
        reader.readAsDataURL(file);
      });
    });
  };

  return { readFile, fileTypes };
}
