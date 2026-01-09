import { useEffect, useState } from "react";
import { useParams } from "react-router";
import api from "../../../auth/api/auth";
import "../../styles/game.css";
import Rating from "../components/Rating";
import CommentItem from "../components/CommentItem";
import CommentField from "../components/CommentField";
import useHighlight from "../../../common_hooks/highlight.hook";

const Game = () => {
  const params = useParams();
  const [game, setGame] = useState({});
  const [comments, setComments] = useState([]);
  const { randomColor, randomShadow, randomBlockShadow } = useHighlight();

  useEffect(() => {
    const getGame = async () => {
      const response = await api.get(`/api/games/game/${params.id}`);
      console.log(response);
      setGame(response.data.game);
      setComments(response.data.game.comments);
    };
    getGame();
  }, [params]);

  const gotoUpdate = () => {
    window.location = `/update-game/${params.id}`;
  };

  return (
    <div className="game-overlay">
      {window.innerWidth > 500 ? (
        <div className="game block">
          <div className="game-top">
            <div>
              <img
                className={`game-top-preview ${randomBlockShadow()}`}
                src={
                  process.env.REACT_APP_API_URL +
                  "/gamepreviews/" +
                  game.previewUrl
                }
                alt=""
              />
              {game.rating && <Rating id={game._id} rating={game.rating} />}
            </div>

            <div className="game-top-info">
              <span
                className={`game-top-info-name ${randomColor()} ${randomShadow()}`}
              >
                {game.name}
              </span>
              <span
                className="game-description"
                style={{ color: "rgb(0, 140, 255)" }}
              >
                Версия: {game.version}
              </span>
              {game.description && window.innerWidth > 500 ? (
                <span className="game-description">{game.description}</span>
              ) : null}
              <a
                href={
                  process.env.REACT_APP_API_URL +
                  "/gamedownloads/" +
                  game.downloadUrl
                }
                download={game.name}
                className="button"
              >
                Скачать APK
              </a>
              <button onClick={gotoUpdate} className="button_default">
                Обновить
              </button>
            </div>
          </div>
          {game.description && window.innerWidth < 500 ? (
            <p className={`game-description ${randomShadow()}`}>
              {game.description}
            </p>
          ) : (
            <></>
          )}
          <CommentField setComments={setComments} />
          {comments.map((item) => (
            <CommentItem item={item} />
          ))}
        </div>
      ) : (
        <div className="game block">
          <div className="game-top">
            <img
              className={`game-top-preview ${randomBlockShadow()}`}
              src={
                process.env.REACT_APP_API_URL +
                "/gamepreviews/" +
                game.previewUrl
              }
              alt=""
            />
            <span
              className={`game-top-info-name ${randomColor()} ${randomShadow()}`}
            >
              {game.name}
            </span>
          </div>
          <div className="game-mobile-info-info">
            <span
              className="game-description"
              style={{ color: "rgb(0, 140, 255)" }}
            >
              Версия: {game.version}
            </span>
            <a
              href={
                process.env.REACT_APP_API_URL +
                "/gamedownloads/" +
                game.downloadUrl
              }
              download={game.name}
              className="button"
            >
              Скачать APK
            </a>
            <p className={`game-description ${randomShadow()}`}>
              {game.description}
            </p>
          </div>
          {game.rating && <Rating id={game._id} rating={game.rating} />}
          <CommentField setComments={setComments} />
          {comments.map((item) => (
            <CommentItem item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Game;
