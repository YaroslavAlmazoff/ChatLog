import { useContext, useEffect, useState } from "react";
import "../../styles/games.css";
import "../../styles/game-item.css";
import "../../styles/form.css";
import GameItem from "../components/GameItem";
import api from "../../../auth/api/auth";
import { AuthContext } from "../../../context/AuthContext";
import { useMemo } from "react";

const Games = () => {
  const auth = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const getGames = async () => {
      const response = await api.get("/api/games/games");
      setGames(response.data.games);
    };
    getGames();
  }, []);

  const gotoCreate = () => {
    window.location = "/create-app";
  };

  const searchedGames = useMemo(() => {
    return [...games].filter((el) => {
      return (
        el.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        el.description.toLowerCase().includes(searchValue.toLowerCase()) ||
        searchValue === "Поиск..."
      );
    });
  }, [games, searchValue]);

  return (
    <div className="games-overlay">
      <div className="games block">
        <div style={{ width: "100%" }}>
          <input
            className="input"
            type="text"
            placeholder="Поиск..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <img
            className="games-img"
            src={require("../../img/games-img.png")}
            alt=""
          />
        </div>
        <div className="games-games">
          {searchedGames.map((item) => (
            <GameItem item={item} />
          ))}
          {auth.userId == "628e5aab0153706a3e18fe79" && (
            <div className="game-item" onClick={gotoCreate}>
              <div className="game-item-add">
                <span className="game-item-add-plus">+</span>
              </div>
              <span className="game-item-name">Добавить</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Games;
