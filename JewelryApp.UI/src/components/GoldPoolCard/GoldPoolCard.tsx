import type { GoldPoolCardProps } from "./GoldPoolCard.type";
import "./goldPoolCard.scss";

const GoldPoolCard = ({
  karat,
  weightGrams,
  valueAmount,
  accentColor,
}: GoldPoolCardProps) => {
  const isEmpty = weightGrams <= 0;
  const avgPerGram = isEmpty ? 0 : valueAmount / weightGrams;

  return (
    <div className={`goldPoolCard ${isEmpty ? "empty" : ""}`}>
      <div className="pool-bar" style={{ background: accentColor }} />
      <div className="pool-head">
        <span className="pool-karat">{karat}K</span>
        <span className="pool-weight">{weightGrams.toFixed(1)}g</span>
      </div>
      {isEmpty ? (
        <div className="pool-row">
          <span className="pool-row-l">Empty</span>
          <span className="pool-row-v">—</span>
        </div>
      ) : (
        <>
          <div className="pool-row">
            <span className="pool-row-l">Avg $/g</span>
            <span className="pool-row-v">${avgPerGram.toFixed(2)}</span>
          </div>
          <div className="pool-row">
            <span className="pool-row-l">Value</span>
            <span className="pool-row-v">
              ${Math.round(valueAmount).toLocaleString()}
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default GoldPoolCard;
