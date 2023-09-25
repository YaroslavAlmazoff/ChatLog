import { useEffect, useState } from "react";
import LPV2Button from "./LPV2Button";
import api from "../../../../../auth/api/auth";

const LPV2Head = () => {
  const [downloadUrl, setDownloadUrl] = useState("");
  useEffect(() => {
    const getDownloadUrl = async () => {
      const response = await api.get(`/api/games/game/${process.env.APP_ID}`);
      setDownloadUrl(response.data.game.downloadUrl);
    };
    getDownloadUrl();
  }, []);
  return (
    <div className="lpv2-block">
      <div id="fountainTextG">
        <div id="fountainTextG_1" class="fountainTextG">
          C
        </div>
        <div id="fountainTextG_2" class="fountainTextG">
          H
        </div>
        <div id="fountainTextG_3" class="fountainTextG">
          A
        </div>
        <div id="fountainTextG_4" class="fountainTextG">
          T
        </div>
        <div id="fountainTextG_5" class="fountainTextG">
          L
        </div>
        <div id="fountainTextG_6" class="fountainTextG">
          O
        </div>
        <div id="fountainTextG_7" class="fountainTextG">
          G
        </div>
      </div>
      <div className="lpv2-buttons">
        <LPV2Button text="Зарегистрироваться" link="/register" />
        <LPV2Button text="Войти" link="/login" />
        {downloadUrl != "" ? (
          <a
            className="button"
            href={
              process.env.REACT_APP_API_URL + `/gamedownloads/${downloadUrl}`
            }
            download="ChatLog"
          >
            Скачать приложение
          </a>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default LPV2Head;
