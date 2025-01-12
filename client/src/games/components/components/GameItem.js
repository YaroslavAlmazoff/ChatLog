import "../../styles/game-item.css";
import useHighlight from "../../../common_hooks/highlight.hook";

const GameItem = ({ item }) => {
  const gotoGame = () => {
    window.location = `/app/${item._id}`;
  };
  const { randomShadow, randomColor, randomBlockShadow } = useHighlight();

  return (
    <div className="game-item" onClick={gotoGame}>
      <img
        className={`game-item-preview ${randomBlockShadow()}`}
        src={process.env.REACT_APP_API_URL + "/gamepreviews/" + item.previewUrl}
        alt=""
      />
      <span className={`game-item-name ${randomColor()} ${randomShadow()}`}>
        {item.name}
      </span>
    </div>
  );
};

export default GameItem;
