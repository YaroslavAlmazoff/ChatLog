import { useState } from "react";
import "../../common.css";

const Search = () => {
  const [question, setQuestion] = useState("");

  const find = () => {
    const searchArr = question.split(" ");
    let str = "";
    for (let word of searchArr) {
      word = word + "+";
      str = str + word;
    }
    const searchStr = `https://www.yandex.ru/search/?text=${str}&lr=225`;
    window.location = searchStr;
  };

  return (
    <div className="home-search">
      <input
        placeholder="Найти что-нибудь в Интернете..."
        className="input"
        style={{ width: "60%" }}
        type="search"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <button onClick={find} className="button ml">
        Найти
      </button>
    </div>
  );
};

export default Search;
