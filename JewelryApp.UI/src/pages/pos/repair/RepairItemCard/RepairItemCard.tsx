import Accordion from "react-bootstrap/Accordion";
import "./repairItemCard.scss";
import type { RepairItem } from "../Repair";

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
            Item #{item.id} — {item.itemType || "Item"} —{" "}
            {item.repairType || "-"} — ${total.toFixed(2)}
          </Accordion.Header>

          <Accordion.Body>
            <div className="quick-item-body">
              <h4 className="section-small-title">Item Information</h4>

              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Item Type *</label>
                  <select
                    className="form-select"
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
                  <label className="form-label">Metal *</label>
                  <select
                    className="form-select"
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
                  <label className="form-label">
                    Weight Before Repair (g)
                  </label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.weight}
                    onChange={(e) =>
                      updateItem(item.id, "weight", e.target.value)
                    }
                  />
                </div>

                <div className="form-col">
                  <label className="form-label">Stone Type</label>
                  <input
                    className="form-input"
                    value={item.stone}
                    onChange={(e) =>
                      updateItem(item.id, "stone", e.target.value)
                    }
                    placeholder="Ruby, Diamond..."
                  />
                </div>
              </div>

              <h4 className="section-small-title">Repair Information</h4>

              <div className="form-group">
                <label className="form-label">Repair Type *</label>
                <select
                  className="form-select"
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
                <label className="form-label">Repair Notes *</label>
                <textarea
                  className="form-textarea"
                  value={item.notes}
                  onChange={(e) =>
                    updateItem(item.id, "notes", e.target.value)
                  }
                />
              </div>

              <h4 className="section-small-title">Pricing</h4>

              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Cost ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.cost}
                    onChange={(e) =>
                      updateItem(item.id, "cost", e.target.value)
                    }
                  />
                </div>

                <div className="form-col">
                  <label className="form-label">Urgent Fee ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.urgent}
                    onChange={(e) =>
                      updateItem(item.id, "urgent", e.target.value)
                    }
                  />
                </div>

                <div className="form-col">
                  <label className="form-label">Discount ($)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={item.discount}
                    onChange={(e) =>
                      updateItem(item.id, "discount", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-col">
                  <label className="form-label">Payment Status</label>
                  <select
                    className="form-select"
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
                  <label className="form-label">Due Date *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={item.dueDate}
                    onChange={(e) =>
                      updateItem(item.id, "dueDate", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="pricing-box">
                <div className="pricing-line">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                className="delete-item-btn"
                onClick={() => removeItem(item.id)}
              >
                <i className="fas fa-trash" /> Remove Item
              </button>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default RepairItemCard;
