import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import api from "../../../auth/api/auth";

const FilePreview = ({ file, fileOpened, ready }) => {
  const [fileText, setFileText] = useState();
  const auth = useContext(AuthContext);
  useEffect(() => {
    const filePreview = async () => {
      if (file.ext === "txt") {
        const response = await api.get(`/api/cloud/filetext/${file._id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setFileText(response.data.text);
      } else if (file.ext === "pdf") {
        setFileText(
          process.env.REACT_APP_API_URL +
            "/" +
            file.path.split("/").slice(4).join("/")
        );
      } else if (file.ext === "doc" || file.ext === "docx") {
        const response = await api.get(`/api/cloud/hardfiletext/${file._id}`, {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setFileText(response.data.text);
      } else {
        console.log("Не ну это капец");
      }
    };
    filePreview();
  }, []);
  return (
    <div className="file-preview">
      {ready && fileOpened ? (
        <div className="file-opened-info">
          <h2
            className="file-opened-preview-name"
            style={{ color: "rgb(0, 140, 255)" }}
          >
            {file.name}
          </h2>
          <a
            className="button open-download-link"
            href={
              process.env.REACT_APP_API_URL +
              "/" +
              file.path.split("/").slice(4).join("/")
            }
            download={file.name}
          >
            Скачать
          </a>
        </div>
      ) : (
        <></>
      )}
      {file.ext === "txt" || file.ext === "doc" || file.ext === "docx" ? (
        <div>
          <br />
          <br />
          <p className="file-preview-text">{fileText}</p>
        </div>
      ) : (
        <></>
      )}
      {file.ext === "jpg" ||
      file.ext === "png" ||
      file.ext === "gif" ||
      file.ext === "bmp" ? (
        <div className="file-img-dark-wrapper">
          <img
            height="400"
            src={
              process.env.REACT_APP_API_URL +
              "/" +
              file.path.split("/").slice(4).join("/")
            }
            alt=""
          />
        </div>
      ) : (
        <></>
      )}
      {file.ext === "mp4" ? (
        <video
          width="300"
          height="200"
          controls
          src={
            process.env.REACT_APP_API_URL +
            "/" +
            file.path.split("/").slice(4).join("/")
          }
        ></video>
      ) : (
        <></>
      )}
      {file.ext === "mp3" ? (
        <audio
          controls
          src={
            process.env.REACT_APP_API_URL +
            "/" +
            file.path.split("/").slice(4).join("/")
          }
        ></audio>
      ) : (
        <></>
      )}
      {file.ext === "pdf" ? (
        <iframe
          title={file.name}
          src={
            process.env.REACT_APP_API_URL +
            "/" +
            file.path.split("/").slice(4).join("/")
          }
          style={{ width: "100%", height: "100%" }}
        ></iframe>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FilePreview;
