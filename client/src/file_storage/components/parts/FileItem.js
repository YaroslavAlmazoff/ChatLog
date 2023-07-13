import "../../styles/file-item.css";
import useWord from "../../../common_hooks/divideWord.hook";
import useFiles from "../../../common_hooks/files.hook";
import { useState, useEffect, useContext } from "react";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import useHighlight from "../../../common_hooks/highlight.hook";
import ContextMenu from "./ContextMenu";
import "../../styles/context-menu.css";

const FileItem = ({
  file,
  setSelectedFile,
  setDetailDisplay,
  setFilePreviewDisplay,
  currentFolder,
  setCurrentFolder,
}) => {
  const auth = useContext(AuthContext);
  const { divideFilename, divideWord } = useWord();
  const { randomColor } = useHighlight();
  const [showMenu, setShowMenu] = useState(false);

  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleClick = (event) => {
    if (file.type == "folder") {
      event.preventDefault();
      setShowMenu(false);
      setShowMenu(true);
      setX(event.pageX);
      setY(event.pageY);
    } else {
      return false;
    }
  };

  const handleMenuClose = () => {
    setShowMenu(false);
  };

  const showDetails = () => {
    setSelectedFile(file);
    setDetailDisplay("flex");
    setFilePreviewDisplay("none");
  };
  const openFolder = async () => {
    setCurrentFolder({ name: file.name, id: file._id });
  };
  const removeFolder = async () => {
    const response = await api.delete(`/api/rmdir/${file._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(response);
    window.location.reload();
  };
  return (
    <div
      onClick={file.type === "folder" ? openFolder : showDetails}
      onContextMenu={handleClick}
      className="file-item"
    >
      {file.ext === "jpg" ||
      file.ext === "jpeg" ||
      file.ext === "png" ||
      file.ext === "gif" ||
      file.ext === "bmp" ? (
        <img
          className="file-img"
          src={
            process.env.REACT_APP_API_URL +
            "/" +
            file.path.split("/").slice(4).join("/")
          }
          alt="file"
        />
      ) : (
        <div>
          {file.ext === "mp4" ? (
            <video
              className="file-img"
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
            <>
              {file.ext !== "" ? (
                <div>
                  {file.ext !== "mp4" ||
                  file.ext !== "jpg" ||
                  file.ext !== "jpeg" ||
                  file.ext !== "png" ||
                  file.ext !== "bmp" ||
                  file.ext !== "gif" ? (
                    <img
                      className="file-icon"
                      src={
                        process.env.REACT_APP_API_URL +
                        `/filesicons/` +
                        file.ext.toLowerCase() +
                        ".png"
                      }
                      alt="img"
                    />
                  ) : (
                    <></>
                  )}
                </div>
              ) : (
                <div>
                  <img
                    className="file-icon"
                    src={
                      process.env.REACT_APP_API_URL +
                      `/filesicons/` +
                      file.type.toLowerCase() +
                      ".png"
                    }
                    alt="img"
                  />
                </div>
              )}
            </>
          )}
        </div>
      )}

      <p className={`file-title ${randomColor()}`}>
        {file.type !== "folder"
          ? divideFilename(file.name)
          : divideWord(file.name)}
      </p>

      {showMenu && (
        <ContextMenu x={x} y={y} onClose={handleMenuClose}>
          {/* Пункты вашего контекстного меню */}
          <li
            style={{ color: "#40A4FF", listStyle: "none" }}
            onClick={removeFolder}
          >
            Удалить папку
          </li>
        </ContextMenu>
      )}
    </div>
  );
};

export default FileItem;
