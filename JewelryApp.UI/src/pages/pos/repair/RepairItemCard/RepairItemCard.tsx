import Accordion from "react-bootstrap/Accordion";
import { FaDollarSign, FaGem, FaTools, FaTrash } from "react-icons/fa";
import {
  PaymentStatus,
  ProductCategory,
  ProductType,
  RepairType,
} from "../../../../types/enums";
import { splitCamelCaseWords } from "../../../../utils";
import type { RepairItem } from "../Repair";
import "./repairItemCard.scss";

const RepairItemCard = ({
  item,
  updateItem,
  removeItem,
  itemsCount,
  cardNumber,
  errors,
}: {
  item: RepairItem;
  updateItem: (id: number, field: keyof RepairItem, value: string) => void;
  removeItem: (id: number) => void;
  itemsCount: number;
  cardNumber: number;
  errors: Record<string, string>;
}) => {
  return (
    <div className="repair-card-wrapper">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="accordion-title">
              <span className="item-id">#{cardNumber}</span>
              <span className="item-label">
                {splitCamelCaseWords(ProductCategory[item.itemType]) || "Item"}
                <span> — </span>
                {splitCamelCaseWords(RepairType[item.repairType]) || "Repair"}
              </span>

              <span className="item-total">
                ${Math.trunc(Number(item.cost) || 0)}
              </span>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            <div className="quick-item-body">
              {/* SECTION 1 */}
              <h4 className="section-small-title">
                <div>
                  <FaGem /> Item Information
                </div>
                {itemsCount > 1 && (
                  <FaTrash
                    className="remove-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                  />
                )}
              </h4>

              <div className="form-row">
                {/* ITEM TYPE */}
                <div className="form-col">
                  <label>Item Type *</label>
                  <select
                    className={errors.itemType ? "input-error" : ""}
                    value={item.itemType}
                    onChange={(e) =>
                      updateItem(item.id, "itemType", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value={ProductCategory.Necklaces}>Necklace</option>
                    <option value={ProductCategory.Bracelets}>Bracelet</option>
                    <option value={ProductCategory.Bangles}>Bangle</option>
                    <option value={ProductCategory.Rings}>Ring</option>
                    <option value={ProductCategory.Earrings}>Earrings</option>
                    <option value={ProductCategory.Pendants}>Pendant</option>
                    <option value={ProductCategory.Bullion}>Bullion</option>
                  </select>
                  {errors.itemType && (
                    <p className="error-text">{errors.itemType}</p>
                  )}
                </div>

                {/* METAL */}
                <div className="form-col">
                  <label>Metal *</label>
                  <select
                    className={errors.metal ? "input-error" : ""}
                    value={item.metal}
                    onChange={(e) =>
                      updateItem(item.id, "metal", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value={ProductType.Gold}>Gold</option>
                    <option value={ProductType.Silver}>Silver</option>
                  </select>
                  {errors.metal && <p className="error-text">{errors.metal}</p>}
                </div>
              </div>

              {/* WEIGHT + STONE */}
              <div className="form-row">
                <div className="form-col">
                  <label>Weight Before Repair (g)</label>
                  <input
                    type="number"
                    onWheel={(e) => e.currentTarget.blur()}
                    value={item.weight}
                    onChange={(e) =>
                      updateItem(item.id, "weight", e.target.value)
                    }
                  />
                </div>

                <div className="form-col">
                  <label>Stone Type</label>
                  <input
                    value={item.stone}
                    onChange={(e) =>
                      updateItem(item.id, "stone", e.target.value)
                    }
                    placeholder="Ruby, Diamond..."
                  />
                </div>
              </div>

              {/* SECTION 2 */}
              <h4 className="section-small-title">
                <div>
                  <FaTools /> Repair Information
                </div>
              </h4>

              {/* REPAIR TYPE */}
              <div className="form-group">
                <label>Repair Type *</label>
                <select
                  className={errors.repairType ? "input-error" : ""}
                  value={item.repairType}
                  onChange={(e) =>
                    updateItem(item.id, "repairType", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value={RepairType.Resize}>Resize</option>
                  <option value={RepairType.Solder}>Solder</option>
                  <option value={RepairType.StoneReplacement}>
                    Stone Replacement
                  </option>
                  <option value={RepairType.StoneTightening}>
                    Stone Tightening
                  </option>
                  <option value={RepairType.Polishing}>Polishing</option>
                  <option value={RepairType.Cleaning}>Cleaning</option>
                  <option value={RepairType.Plating}>Plating</option>
                  <option value={RepairType.Engraving}>Engraving</option>
                  <option value={RepairType.FixOrChangeLock}>
                    Fix/Change Lock
                  </option>
                  <option value={RepairType.AddGold}>Add Gold</option>
                </select>
                {errors.repairType && (
                  <p className="error-text">{errors.repairType}</p>
                )}
              </div>

              {/* NOTES */}
              <div className="form-group">
                <label>Repair Notes</label>
                <textarea
                  value={item.notes}
                  onChange={(e) => updateItem(item.id, "notes", e.target.value)}
                />
              </div>

              {/* SECTION 3 */}
              <h4 className="section-small-title">
                <div>
                  <FaDollarSign /> Pricing
                </div>
              </h4>

              <div className="form-row">
                <div className="form-col">
                  <label>Cost ($)</label>
                  <input
                    onWheel={(e) => e.currentTarget.blur()}
                    step="1"
                    min="0"
                    value={item.cost}
                    onChange={(e) =>
                      updateItem(
                        item.id,
                        "cost",
                        Math.trunc(Number(e.target.value)).toString(),
                      )
                    }
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === ",") e.preventDefault();
                      if (
                        !/[^0-9]/.test(e.key) &&
                        e.currentTarget.value.replace("-", "").length >= 8
                      )
                        e.preventDefault();
                    }}
                  />
                </div>
              </div>

              {/* PAYMENT + DUE DATE */}
              <div className="form-row">
                <div className="form-col">
                  <label>Payment Status</label>
                  <select
                    value={item.paymentStatus || ""}
                    onChange={(e) =>
                      updateItem(item.id, "paymentStatus", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value={PaymentStatus.Unpaid}>Unpaid</option>
                    <option value={PaymentStatus.Paid}>Paid</option>
                  </select>
                </div>

                <div className="form-col">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    className={errors.dueDate ? "input-error" : ""}
                    value={item.dueDate}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) =>
                      updateItem(item.id, "dueDate", e.target.value)
                    }
                  />
                  {errors.dueDate && (
                    <p className="error-text">{errors.dueDate}</p>
                  )}
                </div>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default RepairItemCard;
