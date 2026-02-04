import { useEffect, useState } from "react";
import api from "../auth/api/auth";

const BackupsManager = () => {
  const [backups, setBackups] = useState([]);

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
            onClick={async () => {
              if (
                !window.confirm(
                  "Восстановить курс из этого бэкапа? Текущие изменения будут потеряны.",
                )
              )
                return;

              await api.post("/api/courses/restore", {
                file: b.file,
              });

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
