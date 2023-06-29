import FileItem from "./FileItem";
import "../../styles/files.css";
import { useRef, useContext, useState, useEffect } from "react";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../common_components/Loader";
import useHighlight from "../../../common_hooks/highlight.hook";
import useWord from "../../../common_hooks/divideWord.hook";

const Files = ({
  files,
  setFiles,
  setSelectedFile,
  setDetailDisplay,
  setFilePreviewDisplay,
  currentFolder,
  setCurrentFolder,
  file,
}) => {
  const auth = useContext(AuthContext);
  const fileRef = useRef();
  const { randomColor } = useHighlight();
  const [loadingUploading, setLoadingUploading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [error, setError] = useState("");
  const [path, setPath] = useState([]);
  const { translit } = useWord();
  const emitOpen = () => {
    setLoadingUploading(true);
    fileRef.current.click();
  };
  const getFile = async (e) => {
    let file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", file.name);
    formData.append("folder", JSON.stringify(currentFolder));
    //Загрузка файла в состояние
    const response = await api.post("/api/cloud/upload", formData, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(response);
    setFiles(response.data.files);
    setLoadingUploading(false);
  };
  const makeFolder = async () => {
    const checkResponse = await api.post(
      "/api/cloud/checkfolder",
      { name: folderName },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    console.log(checkResponse);
    if (!checkResponse.data.valid) {
      setError(checkResponse.data.error);
      return;
    }
    const response = await api.post(
      "/api/cloud/mkdir",
      {
        folder: currentFolder.name,
        folderId: currentFolder.id,
        name: folderName,
      },
      { headers: { Authorization: `Bearer ${auth.token}` } }
    );
    console.log(response);
    setFiles(response.data.files);
  };
  const moveToFolder = async (name) => {
    const response = await api.post(
      "/api/cloud/filesbyfolder",
      { name },
      {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      }
    );
    setFiles(response.data.files);
  };

  const goToRoot = async () => {
    const response = await api.get("/api/cloud/rootfiles", {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    console.log(response);
    setFiles(response.data.files);
  };

  useEffect(() => {
    const getPath = async () => {
      console.log(currentFolder.id);
      if (currentFolder.id) {
        const response = await api.get(
          `/api/cloud/getpath/${currentFolder.id}`,
          {
            headers: {
              Authorization: `Bearer ${auth.token}`,
            },
          }
        );
        console.log(response);
        setPath(response.data.path);
      } else {
        setPath([""]);
      }
    };
    getPath();
  }, [auth, currentFolder]);

  return (
    <div className="files">
      <div className="files-head">
        <div className="fl">
          <h2 className="files-head-title">Файловое хранилище</h2>
          <input
            onChange={getFile}
            ref={fileRef}
            type="file"
            accept=".png,.jpg,.jpeg,.mp4,.mp3,.gif,.doc,.docx,.pdf,.txt"
          />
          <button onClick={emitOpen} className="button">
            Загрузить новый файл
          </button>
        </div>
        <div className="add-file">
          <input
            className="input folder-field"
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Название папки"
          />
          <button onClick={makeFolder} className="button folder-button">
            Создать папку
          </button>
        </div>
        <span style={{ color: "#FF073A" }}>{error}</span>
        <div className="cloud-path">
          <span
            onClick={goToRoot}
            className={`file-title ${randomColor()}`}
            style={{ cursor: "pointer" }}
          >
            Корневой каталог /
          </span>
          {path.map((item) => (
            <>
              <span
                onClick={() => moveToFolder(item)}
                className={`file-title ${randomColor()}`}
                style={{ cursor: "pointer" }}
              >
                {" "}
                {item}{" "}
              </span>
              {currentFolder.id && <span>/</span>}
            </>
          ))}
        </div>
      </div>
      <div className="files-body">
        {!loadingUploading ? (
          <div className="files-list">
            {files.map((el) => (
              <FileItem
                key={Math.random()}
                setSelectedFile={setSelectedFile}
                setDetailDisplay={setDetailDisplay}
                setFilePreviewDisplay={setFilePreviewDisplay}
                currentFolder={currentFolder}
                setCurrentFolder={setCurrentFolder}
                file={el}
                showMenu={showMenu}
                setShowMenu={setShowMenu}
              />
            ))}
          </div>
        ) : (
          <Loader ml={"50%"} />
        )}
      </div>
    </div>
  );
};

export default Files;
