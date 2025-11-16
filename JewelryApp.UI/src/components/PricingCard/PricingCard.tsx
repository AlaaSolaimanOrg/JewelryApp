import { FaRedo } from "react-icons/fa";
import "./pricingCard.scss";
import { KaratType, ProductType } from "../../types/enums";
import type { PriceItem } from "../../pages/admin/pricing/Pricing";
import preventSignOnKeyDown from "../../utils";

const PricingCard = ({
  cardTitle,
  prices = [],
  productType,
  handlePriceChange,
  recallGlobalPrices,
  handleProductTypePrices,
  isGlobal = false,
}: {
  cardTitle: string;
  prices: PriceItem[];
  productType: ProductType;
  handlePriceChange?: any;
  recallGlobalPrices?: any;
  handleProductTypePrices?: any;
  isGlobal?: boolean;
}) => {
  const karatLabels: Record<KaratType, string> = {
    [KaratType.Karat18]: "18K",
    [KaratType.Karat21]: "21K",
    [KaratType.Karat22]: "22K",
    [KaratType.Karat24]: "24K",
  };

  return (
    <div className="pricingCard">
      <div className="card-header">
        <h3 className="card-title">{cardTitle}</h3>
      </div>

      <div className="form-row">
        {prices.map((price) => (
          <div
            className="form-col"
            key={`${price.productType}-${price.karatType}`}
          >
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
                min={0}
                onKeyDown={preventSignOnKeyDown}
                onChange={(event) => {
                  const value = event.target.value;
                  handlePriceChange(
                    productType,
                    price.karatType,
                    value ? Number(value) : null
                  );
                }}
                disabled={isGlobal}
              />
            </div>
          </div>
        ))}
      </div>

      {isGlobal ? (
        <div className="form-group">
          <label className="form-label">Pricing Method</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input
                type="radio"
                name={`${ProductType[productType]}-pricing-method`}
                onChange={(e) => {
                  if (e.target.checked) {
                    handleProductTypePrices(productType);
                  }
                }}
              />
              API Integration
            </label>
            <button
              className="btn-md btn-gold"
              onClick={() => {
                recallGlobalPrices();
              }}
            >
              <FaRedo className="icon" /> Refresh Prices
            </button>
          </div>
        </div>
      ) : (
        <div className="form-group">
          <label className="form-label">Pricing Method</label>
          <div style={{ display: "flex", gap: "20px" }}>
            <label
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <input
                type="radio"
                name={`${ProductType[productType]}-pricing-method`}
                defaultChecked
              />
              Manual Pricing
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PricingCard;
