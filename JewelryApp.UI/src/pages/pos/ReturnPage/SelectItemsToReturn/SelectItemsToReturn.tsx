import React from "react";
import {
  FaFire,
  FaFrown,
  FaGem,
  FaMeh,
  FaRing,
  FaShoppingCart,
  FaSmile,
  FaWarehouse,
} from "react-icons/fa";
import CustomTable from "../../../../components/tables/Table/CustomTable";
import {
  ItemCondition,
  ReturnOption,
  ReturnReason,
} from "../../../../types/enums";
import type { TransactionItem } from "../ReturnPage";
import "./selectItemsToReturn.scss";

interface SelectItemsToReturnProps {
  items: TransactionItem[];
  onCheckboxChange: (id: string) => void;
  onQuantityChange: (id: string, value: string) => void;
  onAmountReturnedChange: (id: string, value: string) => void;
  totalReturnAmount: number;
  onReturnReasonChange: (id: string, value: ReturnReason | null) => void;
  onOtherReasonChange: (id: string, value: string) => void;
  onConditionChange: (id: string, value: ItemCondition | null) => void;
  onReturnOptionChange: (id: string, value: ReturnOption | null) => void;
  itemErrors: { [key: number]: string[] };
  isLoadingSale: boolean;
}

const SelectItemsToReturn: React.FC<SelectItemsToReturnProps> = ({
  items,
  onCheckboxChange,
  onQuantityChange,
  onAmountReturnedChange,
  onReturnReasonChange,
  onOtherReasonChange,
  onConditionChange,
  onReturnOptionChange,
  totalReturnAmount,
  itemErrors,
  isLoadingSale,
}) => {
  const headers = [
    { key: "Return", label: "Return" },
    { key: "Product", label: "Product" },
    { key: "Karat", label: "Karat" },
    { key: "Weight", label: "Weight" },
    { key: "UnitPrice", label: "Unit Price" },
    { key: "QtyPurchased", label: "Qty Purchased" },
    { key: "QtytoReturn", label: "Qty to Return" },
    { key: "ReturnedQuantity", label: "Returned Quantity" },
    { key: "AmountReturned", label: "Amount Returned" },
    { key: "ReturnReason", label: "Return Reason" },
    { key: "Condition", label: "Condition" },
    { key: "ReturnOption", label: "Return Option" },
    { key: "ReturnAmount", label: "Amount to Return" },
  ];

  const data = items.map((item) => {
    const errors = itemErrors[item.id] || [];

    const hasError = (msg: string) => errors.includes(msg);

    return {
      Return: item.qtyPurchased > 0 && (
        <input
          type="checkbox"
          className="return-checkbox"
          checked={item.selected}
          onChange={() => onCheckboxChange(item.id)}
        />
      ),

      Product: (
        <div className="product-cell">
          {!!item.productImage && (
            <img
              src={`${import.meta.env.VITE_API_URL}${item.productImage}`}
              alt={item.name ?? ""}
              style={{
                width: "70px",
                height: "70px",
                objectFit: "cover",
                borderRadius: "6px",
                marginRight: "10px",
              }}
            />
          )}
          <span className="product-name">{item.name}</span>
        </div>
      ),

      Karat: <span className="karat-value">{item.karat}</span>,
      Weight: <span className="weight-value">{item.weight}</span>,
      UnitPrice: (
        <span className="unit-price">${item.unitPrice.toFixed(2)}</span>
      ),
      QtyPurchased: <span className="qty-purchased">{item.qtyPurchased}</span>,

      QtytoReturn: (
        <div>
          <input
            type="number"
            className={`return-qty-input ${
              hasError("Quantity must be greater than 0.") ? "input-error" : ""
            }`}
            value={item.qtyToReturn}
            min="0"
            max={item.qtyPurchased}
            onChange={(e) => onQuantityChange(item.id, e.target.value)}
            disabled={!item.selected || item.qtyPurchased === 0}
          />

          {hasError("Quantity must be greater than 0.") && (
            <div className="item-error-message">
              Quantity must be greater than 0.
            </div>
          )}
        </div>
      ),

      ReturnedQuantity: (
        <span className="qty-purchased">{item.quantityReturned}</span>
      ),
      // display the amount that came from the API (non-editable)
      AmountReturned: (
        <span className="amount-returned">
          ${item.apiAmountReturned.toFixed(2)}
        </span>
      ),
      ReturnReason: (
        <div className="return-reason-cell">
          <select
            className={`form-select ${
              hasError("Return reason is required.") ? "input-error" : ""
            }`}
            value={item.returnReason ?? ""}
            onChange={(e) =>
              onReturnReasonChange(
                item.id,
                e.target.value ? Number(e.target.value) : null,
              )
            }
            disabled={!item.selected}
          >
            <option value={""}>Select reason</option>
            <option value={ReturnReason.NotAsExpected}>Not As Expected</option>
            <option value={ReturnReason.WrongSize}>Wrong Size</option>
            <option value={ReturnReason.Defective}>Defective</option>
            <option value={ReturnReason.GiftReturn}>Gift Return</option>
            <option value={ReturnReason.Other}>Other</option>
          </select>

          {hasError("Return reason is required.") && (
            <div className="item-error-message">Return reason is required.</div>
          )}

          {item.returnReason === ReturnReason.Other && item.selected && (
            <div>
              <textarea
                className={`form-textarea ${
                  hasError("Please specify the reason for 'Other'.")
                    ? "input-error"
                    : ""
                }`}
                placeholder="Please specify the reason..."
                value={item.otherReason}
                onChange={(e) => onOtherReasonChange(item.id, e.target.value)}
              />

              {hasError("Please specify the reason for 'Other'.") && (
                <div className="item-error-message">
                  Please specify the reason.
                </div>
              )}
            </div>
          )}
        </div>
      ),

      Condition: (
        <div className="condition-options-vertical">
          {hasError("Item condition is required.") && (
            <div className="item-error-message">Condition required</div>
          )}

          <div
            className={`condition-option-small ${
              item.condition === ItemCondition.Good ? "selected" : ""
            } ${!item.selected ? "disabled" : ""}`}
            onClick={() =>
              item.selected && onConditionChange(item.id, ItemCondition.Good)
            }
          >
            <FaSmile
              style={{
                color:
                  item.condition === ItemCondition.Good ? "#1ea97c" : "#666",
              }}
            />
            <div>Good</div>
          </div>

          <div
            className={`condition-option-small ${
              item.condition === ItemCondition.NeedsPolishing ? "selected" : ""
            } ${!item.selected ? "disabled" : ""}`}
            onClick={() =>
              item.selected &&
              onConditionChange(item.id, ItemCondition.NeedsPolishing)
            }
          >
            <FaMeh
              style={{
                color:
                  item.condition === ItemCondition.NeedsPolishing
                    ? "#ffb300"
                    : "#666",
              }}
            />
            <div>Needs Polish</div>
          </div>

          <div
            className={`condition-option-small ${
              item.condition === ItemCondition.Damaged ? "selected" : ""
            } ${!item.selected ? "disabled" : ""}`}
            onClick={() =>
              item.selected && onConditionChange(item.id, ItemCondition.Damaged)
            }
          >
            <FaFrown
              style={{
                color:
                  item.condition === ItemCondition.Damaged ? "#ff6b6b" : "#666",
              }}
            />
            <div>Damaged</div>
          </div>
        </div>
      ),

      ReturnOption: (
        <div className="return-options-vertical">
          {hasError("Return option is required.") && (
            <div className="item-error-message">Option required</div>
          )}

          <div
            className={`return-option-small ${
              item.returnOption === ReturnOption.ReturnToStock ? "selected" : ""
            } ${!item.selected ? "disabled" : ""}`}
            onClick={() =>
              item.selected &&
              onReturnOptionChange(item.id, ReturnOption.ReturnToStock)
            }
          >
            <FaWarehouse
              style={{
                color:
                  item.returnOption === ReturnOption.ReturnToStock
                    ? "#212529"
                    : "#666",
              }}
            />
            <div>Return to Stock</div>
            <span className="option-description">Available for sale</span>
          </div>

          <div
            className={`return-option-small ${
              item.returnOption === ReturnOption.MeltAfterReturn
                ? "selected"
                : ""
            } ${!item.selected ? "disabled" : ""}`}
            onClick={() =>
              item.selected &&
              onReturnOptionChange(item.id, ReturnOption.MeltAfterReturn)
            }
          >
            <FaFire
              style={{
                color:
                  item.returnOption === ReturnOption.MeltAfterReturn
                    ? "#ff6b6b"
                    : "#666",
              }}
            />
            <div>Melt</div>
            <span className="option-description">Melt for materials</span>
          </div>
        </div>
      ),

      // editable input for the amount to return (user-entered)
      ReturnAmount: (
        <div>
          <input
            type="number"
            className="return-amount-input"
            placeholder={`$${(item.qtyToReturn * item.unitPrice).toFixed(2)}`}
            value={item.returnAmount}
            min="0"
            max={item.qtyToReturn * item.unitPrice}
            step="0.01"
            onChange={(e) => onAmountReturnedChange(item.id, e.target.value)}
            disabled={!item.selected || item.qtyToReturn === 0}
          />
        </div>
      ),
    };
  });

  return (
    <section className="select-items-section">
      <h2 className="section-title">
        <FaShoppingCart /> Select Items to Return
      </h2>

      <CustomTable headers={headers} data={data} isLoading={isLoadingSale} />

      <div className="total-return-amount">
        Total Return Amount:
        <span id="totalReturnAmount">${totalReturnAmount.toFixed(2)}</span>
      </div>
    </section>
  );
};

export default SelectItemsToReturn;
