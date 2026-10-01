import { FaExpand } from "react-icons/fa";
import "./expandButton.scss";

type ExpandButtonProps = {
  onClick: () => void;
};

const ExpandButton = ({ onClick }: ExpandButtonProps) => (
  <button className="expandButton" onClick={onClick}>
    <FaExpand />
  </button>
);

export default ExpandButton;
