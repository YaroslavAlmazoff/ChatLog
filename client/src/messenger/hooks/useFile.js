import { useCallback } from "react";
import { fileSendErrors } from "../data/messengerConfiguration";

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

  const checkFilesSizeLimit = (files, limitMB = 1) => {
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

  const checkErrorWhileSendingFiles = useCallback((files) => {
    const imagesLength = files.imageFiles.length;
    const videosLength = files.videoFiles.length;
    const isError = !checkFilesSizeLimit(files);
    let text = "";
    if (isError) {
      text += fileSendErrors.sizeError;
      if (imagesLength > 0 && videosLength > 0) {
        text += fileSendErrors.tryToLoadSingleFile;
      } else if (
        (imagesLength === 0 && videosLength !== 0) ||
        (videosLength === 0 && imagesLength !== 0)
      ) {
        text += fileSendErrors.singleFileError;
      }
    }
    return { isError, text };
  }, []);

  return {
    readFiles,
    fileFromServer,
    checkFilesSizeLimit,
    checkErrorWhileSendingFiles,
    fileTypes,
  };
}
