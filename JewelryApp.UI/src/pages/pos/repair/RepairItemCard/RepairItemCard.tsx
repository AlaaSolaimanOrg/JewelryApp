import { FaDollarSign } from "react-icons/fa";
import { PaymentStatus } from "../../../../types/enums";
import type { RepairForm } from "../Repair";
import "./repairItemCard.scss";

const RepairItemCard = ({
  form,
  updateField,
  errors,
}: {
  form: RepairForm;
  updateField: (field: keyof RepairForm, value: string) => void;
  errors: Partial<Record<keyof RepairForm, string>>;
}) => {
  return (
    <div className="repair-card-wrapper">
      <div className="quick-item-body">
        {/* NOTES */}
        <div className="form-group">
          <label>Notes *</label>
          <textarea
            className={errors.notes ? "input-error" : ""}
            value={form.notes}
            onChange={(e) => updateField("notes", e.target.value)}
          />
          {errors.notes && <p className="error-text">{errors.notes}</p>}
        </div>

        {/* PRICING */}
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
              onWheel={(e) => e.currentTarget.blur()}
              step="1"
              min="0"
              value={form.cost}
              onChange={(e) =>
                updateField(
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
              value={form.paymentStatus || ""}
              onChange={(e) => updateField("paymentStatus", e.target.value)}
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
              value={form.dueDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => updateField("dueDate", e.target.value)}
            />
            {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepairItemCard;
