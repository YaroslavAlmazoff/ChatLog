import { useNavigate } from "react-router";

const LPV2Button = ({ text, link }) => {
  const navigate = useNavigate();

  const goTo = () => {
    navigate(link);
  };
  return (
    <button className="lpv2-button" onClick={goTo}>
      {text}
    </button>
  );
};

export default LPV2Button;
