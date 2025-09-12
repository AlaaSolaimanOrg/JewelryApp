import { FaRedo } from "react-icons/fa";
import "./pricingCard.scss";
import { KaratType } from "../../types/enums";
import type { PriceItem } from "../../pages/admin/pricing/Pricing";

const PricingCard = ({
  prices = [],
  handlePriceChange = (karatType, value) => {},
  isGlobal = false,
}: {
  prices: PriceItem[];
  handlePriceChange?: any;
  isGlobal?: boolean;
}) => {
  const karatLabels: Record<KaratType, string> = {
    [KaratType.Karat18]: "18K",
    [KaratType.Karat21]: "21K",
    [KaratType.Karat24]: "24K",
  };

  return (
    <div className="pricingCard">
      <div className="card-header">
        <h3 className="card-title">Gold Pricing</h3>
      </div>

      <div className="form-row">
        {prices.map((price) => (
          <div className="form-col">
            <div className="form-group">
              <label className={`form-label ${!isGlobal ? "required" : ""}`}>
                {`${karatLabels[price.karatType]} Price/Gram ($)`}
              </label>
              <input
                type="number"
                step="0.01"
                className={`form-control ${
                  isGlobal ? "disabled-gold-input" : ""
                }`}
                value={price.pricePerGram}
                onChange={(event) =>
                  handlePriceChange(price.karatType, Number(event.target.value))
                }
                disabled={isGlobal}
              />
            </div>
          </div>
        ))}
      </div>

      {isGlobal ? (
        <button className="btn-md btn-gold">
          <FaRedo className="icon" /> Refresh Prices
        </button>
      ) : (
        <div className="form-group">
          <label className="form-label">Pricing Method</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input type="radio" name="pricing-method" defaultChecked />
              Manual Pricing
            </label>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input type="radio" name="pricing-method" /> API Integration
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCard;
