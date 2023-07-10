import { useEffect, useState, useContext } from "react";
import Files from "../parts/Files";
import FileDetail from "../parts/FileDetail";
import "../../styles/file-storage.css";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import Loader from "../../../common_components/Loader";
import useVerify from "../../../common_hooks/verify.hook";

const FileStorage = () => {
  const auth = useContext(AuthContext);
  const { verify } = useVerify();
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState({});
  const [detailDisplay, setDetailDisplay] = useState("none");
  const [downloadingFile, setDownloadingFile] = useState(
    require("../../../static/useravatars/user.png")
  );
  const [filePreviewDisplay, setFilePreviewDisplay] = useState("none");
  const [filesLoading, setFilesLoading] = useState(false);
  const [currentFolder, setCurrentFolder] = useState({ name: "root", id: "" });
  useEffect(() => {
    verify();
    setFilesLoading(true);
    if (!auth.userId) return;
    const getFiles = async () => {
      console.log(JSON.stringify(currentFolder));
      const response = await api.post(
        `/api/cloud/files`,
        { folder: JSON.stringify(currentFolder) },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      );
      console.log(response);
      setFiles(response.data.files);
      setFilesLoading(false);
    };
    getFiles();
  }, [auth, currentFolder]);
  return (
    <div className="file-storage">
      {!filesLoading ? (
        <Files
          setFilePreviewDisplay={setFilePreviewDisplay}
          setSelectedFile={setSelectedFile}
          files={files}
          setFiles={setFiles}
          setDetailDisplay={setDetailDisplay}
          currentFolder={currentFolder}
          setCurrentFolder={setCurrentFolder}
          file={selectedFile}
        />
      ) : (
        <Loader ml={"50%"} />
      )}
      <div className="file-detail-wrapper">
        {JSON.stringify(selectedFile) !== "{}" ? (
          <FileDetail
            setFiles={setFiles}
            downloadingFile={downloadingFile}
            setDownloadingFile={setDownloadingFile}
            file={selectedFile}
            detailDisplay={detailDisplay}
            filePreviewDisplay={filePreviewDisplay}
            setFilePreviewDisplay={setFilePreviewDisplay}
          />
        ) : (
          <></>
        )}
        <div className="file-empty-element"></div>
      </div>
    </div>
  );
};

export default FileStorage;
