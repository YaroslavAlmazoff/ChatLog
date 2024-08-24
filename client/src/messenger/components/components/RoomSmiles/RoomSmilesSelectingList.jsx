import RoomSmileItem from "./RoomSmileItem";
import { smiles } from "../../../data/smiles";

export default function RoomSmilesSelectingList({ onSmileClick }) {
  return (
    <div className="room-smiles">
      {smiles.map((smile) => (
        <RoomSmileItem
          smile={smile}
          onSmileClick={onSmileClick}
          key={smile.code}
        />
      ))}
    </div>
  );
}
