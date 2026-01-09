import "../../styles/file-detail.css";
import useFileSize from "../../hooks/FileSize.hook";
import useWord from "../../../common_hooks/divideWord.hook";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import { useContext, useState } from "react";
import FilePreview from "./FilePreview";
import LinkRecipientsList from "./LinkRecipientsList";
import RecipientsList from "./RecipientsList";
import Loader from "../../../common_components/Loader";

const FileDetail = ({ file, detailDisplay }) => {
  const [linkRecipientsDisplay, setLinkRecipientsDisplay] = useState("none");
  const [recipientsDisplay, setRecipientsDisplay] = useState("none");
  const [previewOpened, setPreviewOpened] = useState(false);
  const auth = useContext(AuthContext);
  const { divideFilename } = useWord();
  const { fileSize } = useFileSize();
  const openFile = async () => {
    window.location = `/cloud/file/${file._id}`;
  };
  const sendFile = () => {
    setRecipientsDisplay("block");
  };
  const sendFileLink = () => {
    setLinkRecipientsDisplay("block");
  };
  const deleteFile = async () => {
    await api.get(`/api/cloud/delete/${file._id}`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    });
    window.location.reload();
  };
  return (
    <div className="file-detail" style={{ display: detailDisplay }}>
      <table className="file-table">
        <thead className="file-table-head">
          <th className="file-table-head-title">Имя</th>
          <th className="file-table-head-title">Тип</th>
          <th className="file-table-head-title">Размер</th>
        </thead>
        <tbody className="file-table-body">
          <tr className="file-table-row">
            <td className="file-info">{divideFilename(file.name, 20)}</td>
            <td className="file-info">{file.type}</td>
            <td className="file-info">{fileSize(file.size)}</td>
          </tr>
        </tbody>
      </table>
      <div className="file-actions">
        {file.ext === "txt" ||
        file.ext === "jpg" ||
        file.ext === "jpeg" ||
        file.ext === "png" ||
        file.ext === "gif" ||
        file.ext === "mp3" ||
        file.ext === "mp4" ? (
          <button onClick={sendFileLink} className="button ml">
            Отправить ссылку на файл
          </button>
        ) : null}
        <button onClick={sendFile} className="button ml">
          Отправить файл
        </button>
        {file.ext === "txt" ||
        file.ext === "jpg" ||
        file.ext === "jpeg" ||
        file.ext === "png" ||
        file.ext === "gif" ||
        file.ext === "mp3" ||
        file.ext === "mp4" ? (
          <>
            <button
              onClick={() => setPreviewOpened(true)}
              className="button ml"
            >
              Предпросмотр файла
            </button>
            <button onClick={openFile} className="button ml">
              Открыть файл
            </button>
          </>
        ) : null}
        <a
          className="button ml"
          href={
            process.env.REACT_APP_API_URL +
            "/" +
            file.path.split("/").slice(4).join("/")
          }
          download={file.name}
        >
          Скачать
        </a>
        <button onClick={deleteFile} className="button ml">
          Удалить
        </button>
      </div>
      {previewOpened && (
        <FilePreview file={file} ready={false} fileOpened={false} />
      )}
      <LinkRecipientsList
        file={file}
        linkRecipientsDisplay={linkRecipientsDisplay}
      />
      <RecipientsList
        file={file}
        recipientsDisplay={recipientsDisplay}
        setRecipientsDisplay={setRecipientsDisplay}
      />
    </div>
  );
};

export default FileDetail;
