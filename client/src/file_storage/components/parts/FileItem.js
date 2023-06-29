import "../../styles/file-item.css";
import useWord from "../../../common_hooks/divideWord.hook";
import useFiles from "../../../common_hooks/files.hook";
import { useState, useEffect, useContext } from "react";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import useHighlight from "../../../common_hooks/highlight.hook";
import ContextMenu from "./ContextMenu";

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
  const { randomBlockShadow, randomColor, randomShadow } = useHighlight();

  const [showMenu, setShowMenu] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  const handleClick = (event) => {
    event.preventDefault();
    setShowMenu(true);
    setX(event.pageX);
    setY(event.pageY);
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
  return (
    <div
      onClick={file.type === "folder" ? openFolder : showDetails}
      onContextMenu={handleClick}
      className="file-item"
    >
      <ul id="context-menu">
        <li>Пункт 1</li>
        <li>Пункт 2</li>
        <li>Пункт 3</li>
      </ul>
      {file.ext === "jpg" ||
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
          <li>Пункт 1</li>
          <li>Пункт 2</li>
          <li>Пункт 3</li>
        </ContextMenu>
      )}
    </div>
  );
};

export default FileItem;
