import React, { useMemo, useState } from "react";
import "./repair.scss";

const Repair: React.FC = () => {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState<any | null>(null);

  const [item, setItem] = useState({
    type: "",
    metal: "",
    karat: "",
    weight: "",
  });
  const [stones, setStones] = useState("");
  const [itemDescription, setItemDescription] = useState("");

  const [selectedRepair, setSelectedRepair] = useState<string | null>(null);
  const [otherRepair, setOtherRepair] = useState("");
  const [repairDescription, setRepairDescription] = useState("");

  const [repairCost, setRepairCost] = useState<number | "">("");
  const [urgentFee, setUrgentFee] = useState<number | "">("");
  const [discount, setDiscount] = useState<number | "">("");

  const total = useMemo(() => {
    const rc = Number(repairCost) || 0;
    const uf = Number(urgentFee) || 0;
    const d = Number(discount) || 0;
    return rc + uf - d;
  }, [repairCost, urgentFee, discount]);

  function handleSearchKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      // Demo behaviour: populate a fake customer when user presses Enter
      setCustomer({
        name: "Sarah Johnson",
        email: "sarah.j@example.com",
        phone: "(555) 987-6543",
        since: "January 2022",
      });
    }
  }

  function handleSelectRepair(key: string) {
    setSelectedRepair(key);
    if (key !== "other") setOtherRepair("");
  }

  function handleSaveRepair() {
    // TODO: wire to real API. For now, log the payload.
    const payload = {
      customer,
      item: { ...item, stones, itemDescription },
      repair: {
        type: selectedRepair === "other" ? otherRepair : selectedRepair,
        description: repairDescription,
      },
      pricing: {
        repairCost: Number(repairCost) || 0,
        urgentFee: Number(urgentFee) || 0,
        discount: Number(discount) || 0,
        total,
      },
    };
    // eslint-disable-next-line no-console
    console.log("Save repair payload:", payload);
    alert("Repair saved (demo). Check console for payload.");
  }

  return (
    <div className="repair-page">
      <div className="repair-container">
        <header className="repair-header">
          <div className="repair-logo">
            <i className="fas fa-tools" />
            GoldCraft POS - New Repair
          </div>

          <div className="repair-search-section">
            <div className="repair-search-tabs">
              <div className={`repair-search-tab active`}>Name</div>
              <div className={`repair-search-tab`}>Phone</div>
              <div className={`repair-search-tab`}>Email</div>
            </div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKey}
              className="repair-search-input"
              placeholder="Search customer..."
            />
          </div>

          <button
            className="repair-back-btn"
            onClick={() => window.history.back()}
          >
            <i className="fas fa-arrow-left" /> Back to POS
          </button>
        </header>

        <section className="repair-section">
          <h2 className="repair-section-title">
            <i className="fas fa-user" /> Customer Information
          </h2>

          <div className={`repair-customer-card ${customer ? "active" : ""}`}>
            {customer && (
              <>
                <div className="repair-customer-header">
                  <div className="repair-customer-name">{customer.name}</div>
                </div>
                <div className="repair-customer-details">
                  <div>
                    <div className="repair-detail-label">Email</div>
                    <div className="repair-detail-value">{customer.email}</div>
                  </div>
                  <div>
                    <div className="repair-detail-label">Phone</div>
                    <div className="repair-detail-value">{customer.phone}</div>
                  </div>
                  <div>
                    <div className="repair-detail-label">Customer Since</div>
                    <div className="repair-detail-value">{customer.since}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button className="repair-add-customer-btn">
            <i className="fas fa-user-plus" /> Add New Customer
          </button>
        </section>

        <section className="repair-section">
          <h2 className="repair-section-title">
            <i className="fas fa-ring" /> Item Information
          </h2>

          <div className="repair-form-row">
            <div className="repair-form-group">
              <label>Item Type *</label>
              <select
                className="repair-select"
                value={item.type}
                onChange={(e) => setItem({ ...item, type: e.target.value })}
              >
                <option value="">Select item type</option>
                <option value="ring">Ring</option>
                <option value="necklace">Necklace</option>
                <option value="bracelet">Bracelet</option>
                <option value="earrings">Earrings</option>
                <option value="pendant">Pendant</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="repair-form-group">
              <label>Metal Type *</label>
              <select
                className="repair-select"
                value={item.metal}
                onChange={(e) => setItem({ ...item, metal: e.target.value })}
              >
                <option value="">Select metal</option>
                <option value="gold">Gold</option>
                <option value="silver">Silver</option>
                <option value="platinum">Platinum</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className="repair-form-row">
            <div className="repair-form-group">
              <label>Karat</label>
              <select
                className="repair-select"
                value={item.karat}
                onChange={(e) => setItem({ ...item, karat: e.target.value })}
              >
                <option value="">Select karat</option>
                <option value="10k">10K</option>
                <option value="14k">14K</option>
                <option value="18k">18K</option>
                <option value="21k">21K</option>
                <option value="22k">22K</option>
                <option value="24k">24K</option>
              </select>
            </div>
            <div className="repair-form-group">
              <label>Weight (grams)</label>
              <input
                className="repair-input"
                type="number"
                step="0.1"
                min="0"
                value={item.weight}
                onChange={(e) => setItem({ ...item, weight: e.target.value })}
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="repair-form-group">
            <label>Stones Description</label>
            <textarea
              className="repair-textarea"
              value={stones}
              onChange={(e) => setStones(e.target.value)}
              placeholder="Describe any stones in the item..."
            />
          </div>

          <div className="repair-form-group">
            <label>Item Description *</label>
            <textarea
              className="repair-textarea"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              placeholder="Describe the item and any identifying features..."
            />
          </div>
        </section>

        <section className="repair-section">
          <h2 className="repair-section-title">
            <i className="fas fa-tools" /> Repair Type
          </h2>

          <div className="repair-options">
            {[
              ["resize", "expand-alt", "Resize", "Adjust ring size"],
              ["solder", "fire", "Solder", "Repair breaks or joins"],
              [
                "polishing",
                "sparkles",
                "Polishing",
                "Restore shine and finish",
              ],
              ["lock", "lock", "Lock Repair", "Fix clasps and locks"],
              ["cleaning", "broom", "Cleaning", "Professional cleaning"],
              ["plating", "fill-drip", "Plating", "Rhodium or other plating"],
              [
                "stone_setting",
                "gem",
                "Stone Setting",
                "Set or replace stones",
              ],
              ["other", "cog", "Other", "Custom repair"],
            ].map(([key, icon, title, desc]) => (
              <div
                key={String(key)}
                className={`repair-option ${
                  selectedRepair === String(key) ? "selected" : ""
                }`}
                onClick={() => handleSelectRepair(String(key))}
              >
                <i className={`fas fa-${icon}`} />
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>

          {selectedRepair === "other" && (
            <div className="repair-form-group">
              <label>Specify Repair Type</label>
              <input
                className="repair-input"
                value={otherRepair}
                onChange={(e) => setOtherRepair(e.target.value)}
                placeholder="Describe the repair needed..."
              />
            </div>
          )}

          <div className="repair-form-group">
            <label>Repair Description *</label>
            <textarea
              className="repair-textarea"
              value={repairDescription}
              onChange={(e) => setRepairDescription(e.target.value)}
              placeholder="Detailed description of the repair needed..."
            />
          </div>
        </section>

        <section className="repair-section">
          <h2 className="repair-section-title">
            <i className="fas fa-dollar-sign" /> Pricing & Details
          </h2>

          <div className="repair-form-row">
            <div className="repair-form-group">
              <label>Repair Cost ($) *</label>
              <input
                className="repair-input"
                type="number"
                step="0.01"
                min="0"
                value={repairCost === "" ? "" : repairCost}
                onChange={(e) =>
                  setRepairCost(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="0.00"
              />
            </div>
            <div className="repair-form-group">
              <label>Payment Status</label>
              <select className="repair-select">
                <option value="not_paid">Not Paid</option>
                <option value="paid">Paid</option>
                <option value="deposit">Deposit Paid</option>
              </select>
            </div>
          </div>

          <div className="repair-form-row">
            <div className="repair-form-group">
              <label>Due Date *</label>
              <input className="repair-input" type="date" />
            </div>
            <div className="repair-form-group">
              <label>Urgent Fee ($)</label>
              <input
                className="repair-input"
                type="number"
                step="0.01"
                min="0"
                value={urgentFee === "" ? "" : urgentFee}
                onChange={(e) =>
                  setUrgentFee(
                    e.target.value === "" ? "" : Number(e.target.value)
                  )
                }
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="repair-form-group">
            <label>Discount ($)</label>
            <input
              className="repair-input"
              type="number"
              step="0.01"
              min="0"
              value={discount === "" ? "" : discount}
              onChange={(e) =>
                setDiscount(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="0.00"
            />
          </div>

          <div className="repair-pricing-section">
            <div className="repair-pricing-row">
              <span>Repair Cost:</span>
              <span>${Number(repairCost || 0).toFixed(2)}</span>
            </div>
            <div className="repair-pricing-row">
              <span>Urgent Fee:</span>
              <span>${Number(urgentFee || 0).toFixed(2)}</span>
            </div>
            <div className="repair-pricing-row">
              <span>Discount:</span>
              <span>-${Number(discount || 0).toFixed(2)}</span>
            </div>
            <div className="repair-pricing-row total">
              <span>Total:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <div className="repair-footer-buttons">
          <button className="repair-save-btn" onClick={handleSaveRepair}>
            <i className="fas fa-save" /> Save Repair
          </button>
          <button className="repair-print-btn" onClick={() => window.print()}>
            <i className="fas fa-print" /> Print Receipt
          </button>
          <button
            className="repair-cancel-btn"
            onClick={() => window.history.back()}
          >
            <i className="fas fa-times-circle" /> Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Repair;
