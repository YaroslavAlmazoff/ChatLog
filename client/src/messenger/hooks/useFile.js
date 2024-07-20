export default function useFile() {
  const fileTypes = {
    images: "images",
    videos: "videos",
  };

  const readFiles = (event, limit) => {
    return new Promise((resolve) => {
      const resultFiles = [];
      const files = Array.from(event.target.files);
      const filesToRead = Math.min(files.length, limit - resultFiles.length);
      let filesRead = 0;

      files.slice(0, filesToRead).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resultFiles.push({
            file: file,
            url: e.target.result,
          });

          filesRead += 1;
          if (filesRead === files.length) {
            resolve({ files: resultFiles, error: files.length > filesToRead });
          }
        };
        reader.readAsDataURL(file);
      });
    });
  };

  return { readFiles, fileTypes };
}
