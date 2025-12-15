import { useState } from "react";
import { Card, Form } from "react-bootstrap";
import { FaBoxOpen, FaClipboardList, FaUndo } from "react-icons/fa";
import { getInventoryReports } from "../../../apis/products.api/products.api";
import useLocalApi from "../../../hooks/useLocalApi";
import "./inventoryReports.scss";

interface DateRange {
  dateFrom: string | null;
  dateTo: string | null;
}

const InventoryReports = () => {
  const [appliedDateRange, setAppliedDateRange] = useState<DateRange>({
    dateFrom: null,
    dateTo: null,
  });
  const [dateRange, setDateRange] = useState<DateRange>({
    dateFrom: null,
    dateTo: null,
  });

  const { data: inventoryReports } = useLocalApi({
    apiToCall: (data) => getInventoryReports(data.payload),
    payload: {
      dateFrom: appliedDateRange.dateFrom,
      dateTo: appliedDateRange.dateTo,
    },
    effectDependency: [appliedDateRange],
  }) as {
    data: {
      added: any[];
      returned: any[];
    };
    isLoading: boolean;
  };
  console.log(dateRange);

  /* ================= HANDLERS ================= */

  const handleApply = () => {
    setAppliedDateRange(dateRange);
  };

  const handleAllTime = () => {
    setDateRange({ dateFrom: null, dateTo: null });
    setAppliedDateRange({ dateFrom: null, dateTo: null });
  };

  /* ================= RENDER ================= */

  const renderCards = (
    title: string,
    icon: React.ReactNode,
    rows: any[],
    accent?: "gold"
  ) => (
    <div className="inventory-report-group">
      <h4 className="section-subtitle">
        {icon} {title}
      </h4>

      <div className="summary-cards">
        {rows?.map((r) => (
          <div key={r.karatType} className={`summary-card ${accent ?? ""}`}>
            <h3>{r.karatType}K Gold</h3>
            <div className="amount">{r.itemCount} items</div>
            <div className="sub-info">{r.totalWeight.toFixed(2)} g</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div id="inventory-reports" className="page">
      {/* ================= PAGE HEADER ================= */}
      <div className="page-header">
        <h1 className="page-title">
          <FaClipboardList className="icon" />
          <span>Inventory Reports</span>
        </h1>

        <div className="page-actions">
          <div className="date-filters">
            <Form.Control
              type="date"
              value={dateRange.dateFrom ?? ""}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  dateFrom: e.target.value || null,
                }))
              }
            />

            <Form.Control
              type="date"
              value={dateRange.dateTo ?? ""}
              onChange={(e) =>
                setDateRange((prev) => ({
                  ...prev,
                  dateTo: e.target.value || null,
                }))
              }
            />

            <button
              className="btn-md btn-gold"
              onClick={handleApply}
              disabled={!dateRange.dateFrom || !dateRange.dateTo}
            >
              Apply
            </button>

            <button
              className="btn-md btn-gold"
              onClick={handleAllTime}
              disabled={
                appliedDateRange.dateFrom == null &&
                appliedDateRange.dateTo == null
              }
            >
              All Time
            </button>
          </div>
        </div>
      </div>

      {/* ================= CONTENT ================= */}
      <Card className="inventory-reports-wrapper">
        {renderCards(
          "Items Added",
          <FaBoxOpen className="icon" />,
          inventoryReports?.added ?? []
        )}

        {renderCards(
          "Items Returned",
          <FaUndo className="icon" />,
          inventoryReports?.returned ?? [],
          "gold"
        )}
      </Card>
    </div>
  );
};

export default InventoryReports;
