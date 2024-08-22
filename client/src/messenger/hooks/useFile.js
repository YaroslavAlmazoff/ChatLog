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
          if (filesRead === filesToRead) {
            resolve({ files: resultFiles, error: files.length > filesToRead });
          }
        };
        reader.readAsDataURL(file);
      });
      if (filesToRead === 0) {
        resolve(resultFiles);
      }
    });
  };

  const checkFilesSizeLimit = (files, limitMB = 50) => {
    const imageFiles = files.imageFiles || [];
    const videoFiles = files.videoFiles || [];

    const totalSizeInBytes = [...imageFiles, ...videoFiles].reduce(
      (total, { file }) => {
        return total + file.size;
      },
      0
    );
    const totalSizeInMB = totalSizeInBytes / (1024 * 1024);
    return totalSizeInMB <= limitMB;
  };

  const fileFromServer = (folder, name) => {
    return `${process.env.REACT_APP_API_URL}/${folder}/${name}`;
  };

  return { readFiles, fileFromServer, checkFilesSizeLimit, fileTypes };
}
