export default function RoomSmileItem({ smile, onSmileClick }) {
  return (
    <div className="smile-wrapper" onClick={() => onSmileClick(smile.code)}>
      <span role="img" className="smile-image">
        {smile.code}
      </span>
    </div>
  );
}
