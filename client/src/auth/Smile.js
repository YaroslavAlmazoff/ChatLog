import "./styles/smiles.css";

const Smile = ({ el, addSmile }) => {
  return (
    <div className="smile-wrapper" onClick={() => addSmile(el.code)}>
      <span role="img" className="smile-img">
        {el.code}
      </span>
    </div>
  );
};

export default Smile;
