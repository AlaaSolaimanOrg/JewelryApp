import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import "./actionCard.scss";

interface ActionCardProps {
  icon: ReactNode;
  label: string;
  sub: string;
  to: string;
}

const ActionCard = ({ icon, label, sub, to }: ActionCardProps) => (
  <Link to={to} className="dash-action-btn text-decoration-none">
    <span className="dash-act-icon">{icon}</span>
    <span className="dash-act-label">{label}</span>
    <span className="dash-act-sub">{sub}</span>
  </Link>
);

export default ActionCard;
