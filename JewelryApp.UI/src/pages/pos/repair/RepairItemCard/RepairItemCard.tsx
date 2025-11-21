import Accordion from "react-bootstrap/Accordion";
import "./repairItemCard.scss";
import type { RepairItem } from "../Repair";
import { FaTools, FaGem, FaDollarSign, FaTrash } from "react-icons/fa";

const RepairItemCard = ({
  item,
  updateItem,
  removeItem,
  calculateItemTotal,
}: {
  item: RepairItem;
  updateItem: (id: number, field: keyof RepairItem, value: string) => void;
  removeItem: (id: number) => void;
  calculateItemTotal: (item: RepairItem) => number;
}) => {
  const total = calculateItemTotal(item);

  return (
    <div className="repair-card-wrapper">
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="accordion-title">
              <span className="item-id">#{item.id}</span>
              <span className="item-label">
                {item.itemType || "Item"} — {item.repairType || "Repair"}
              </span>

              <span className="item-total">${total.toFixed(2)}</span>
            </div>
          </Accordion.Header>

          <Accordion.Body>
            <div className="quick-item-body">
              {/* SECTION 1 */}
              <h4 className="section-small-title">
                <div>
                  <FaGem /> Item Information
                </div>

                <FaTrash
                  className="remove-icon"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent accordion collapse
                    removeItem(item.id);
                  }}
                />
              </h4>

              <div className="form-row">
                <div className="form-col">
                  <label>Item Type *</label>
                  <select
                    value={item.itemType}
                    onChange={(e) =>
                      updateItem(item.id, "itemType", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option>Ring</option>
                    <option>Necklace</option>
                    <option>Bracelet</option>
                    <option>Earrings</option>
                    <option>Pendant</option>
                  </select>
                </div>

                <div className="form-col">
                  <label>Metal *</label>
                  <select
                    value={item.metal}
                    onChange={(e) =>
                      updateItem(item.id, "metal", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option>Gold</option>
                    <option>Silver</option>
                    <option>Platinum</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <label>Weight Before Repair (g)</label>
                  <input
                    type="number"
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

              <div className="form-group">
                <label>Repair Type *</label>
                <select
                  value={item.repairType}
                  onChange={(e) =>
                    updateItem(item.id, "repairType", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option>Resize</option>
                  <option>Solder</option>
                  <option>Stone Replacement</option>
                  <option>Stone Tightening</option>
                  <option>Polishing</option>
                  <option>Cleaning</option>
                  <option>Plating</option>
                  <option>Engraving</option>
                  <option>Fix/Change Lock</option>
                  <option>Add Gold</option>
                </select>
              </div>

              <div className="form-group">
                <label>Repair Notes *</label>
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
                    type="number"
                    value={item.cost}
                    onChange={(e) =>
                      updateItem(item.id, "cost", e.target.value)
                    }
                  />
                </div>

                <div className="form-col">
                  <label>Urgent Fee ($)</label>
                  <input
                    type="number"
                    value={item.urgent}
                    onChange={(e) =>
                      updateItem(item.id, "urgent", e.target.value)
                    }
                  />
                </div>

                <div className="form-col">
                  <label>Discount ($)</label>
                  <input
                    type="number"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(item.id, "discount", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <label>Payment Status</label>
                  <select
                    value={item.paymentStatus}
                    onChange={(e) =>
                      updateItem(item.id, "paymentStatus", e.target.value)
                    }
                  >
                    <option>Not Paid</option>
                    <option>Paid</option>
                    <option>Deposit Paid</option>
                  </select>
                </div>

                <div className="form-col">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={item.dueDate}
                    onChange={(e) =>
                      updateItem(item.id, "dueDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* SUMMARY */}
              <div className="pricing-summary">
                <strong>Subtotal:</strong>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default RepairItemCard;
