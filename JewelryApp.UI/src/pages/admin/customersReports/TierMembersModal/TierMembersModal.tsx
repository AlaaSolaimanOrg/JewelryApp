import { FaTimes } from "react-icons/fa";
import { fmtCurrency } from "../CustomersReports.utils";
import type { TierMembersModalProps } from "./TierMembersModal.type";
import "./tierMembersModal.scss";

const TierMembersModal = ({ show, tier, onClose }: TierMembersModalProps) => {
  if (!show || !tier) return null;

  return (
    <div className="tierMembersModal mo" onClick={onClose}>
      <div className="mo-box" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <span className="mo-title">
            <span className="mo-tier-badge" style={{ background: tier.bg, color: tier.color }}>
              {tier.name}
            </span>
            {tier.minLabel} lifetime
          </span>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className="mo-sub">
          {tier.count.toLocaleString()} customers · {(tier.total / 1e6).toFixed(1)}M combined lifetime spend
          {tier.count > tier.members.length ? ` — showing top ${tier.members.length}` : ""}
        </div>

        <div className="tier-members">
          {tier.members.map((m, i) => (
            <div className="tm-row" key={m.name}>
              <div>
                <span className="tm-rank">{i + 1}</span>
                <span className="tm-name">{m.name}</span>
                <span className="tm-purchases">{m.purchases} purchases</span>
              </div>
              <span className="tm-spent">{fmtCurrency(m.spent)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TierMembersModal;
