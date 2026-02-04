import { useContext, useEffect, useState } from "react";
import api from "../auth/api/auth";
import { AuthContext } from "../context/AuthContext";

const BackupsManager = () => {
  const [backups, setBackups] = useState([]);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const loadBackups = async () => {
      const res = await api.get("/api/courses/backups");
      setBackups(res.data);
    };
    loadBackups();
  }, []);

  return (
    <div className="editor-backups">
      <h3>🕒 Автобэкапы</h3>

      {backups.length === 0 && <div>Нет бэкапов</div>}

      {backups.map((b) => (
        <div key={b.file} className="backup-row">
          <span>{b.createdAt}</span>

          <button
            className="course-editor-restore-button"
            onClick={async () => {
              if (
                !window.confirm(
                  "Восстановить курс из этого бэкапа? Текущие изменения будут потеряны.",
                )
              )
                return;

              await api.post(
                "/api/courses/restore",
                {
                  file: b.file,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                },
              );

              window.location.reload();
            }}
          >
            ♻️ Восстановить
          </button>
        </div>
      ))}
    </div>
  );
};

export default BackupsManager;
