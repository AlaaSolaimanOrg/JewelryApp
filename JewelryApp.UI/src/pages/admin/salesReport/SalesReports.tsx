import { Stack } from "react-bootstrap";
import {
  FaChartBar,
  FaShoppingCart,
  FaUsers,
  FaWeightHanging,
} from "react-icons/fa";
import "./salesReports.scss";
import ReceiptModal from "../../../components/ReceiptModal/ReceiptModal";
import DatePicker from "react-datepicker";
import { useState } from "react";
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { DatePillFilter, KaratType } from "../../../types/enums";
import { getSalesInsights } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";

interface SalesInsights {
  totalSalesAmount: number;
  cashAmountPaid: number;
  cardAmountPaid: number;
  discountAmount: number;
  goldByKarat: {
    karatType: KaratType;
    weight: number;
    pricePerGram: number;
    totalValue: number;
  }[];
}

const SalesReports = () => {
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(addDays(new Date(), 1));
  const [dateFilterPill, setDateFilterPill] = useState<DatePillFilter | null>(
    DatePillFilter.All
  );
  const [appliedDateFilter, setAppliedDateFilter] = useState<any>(null);

  const today = new Date();

  console.log("appliedDateFilter", appliedDateFilter);

  const pillOptions = [
    {
      label: "All",
      value: DatePillFilter.All,
      startDate: null,
      endDate: null,
    },
    {
      label: "Today",
      value: DatePillFilter.Today,
      startDate: startOfDay(today),
      endDate: endOfDay(today),
    },
    {
      label: "This Week",
      value: DatePillFilter.ThisWeek,
      startDate: startOfWeek(today, { weekStartsOn: 1 }), // week starts on Monday
      endDate: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: "This Month",
      value: DatePillFilter.ThisMonth,
      startDate: startOfMonth(today),
      endDate: endOfMonth(today),
    },
    {
      label: "This Year",
      value: DatePillFilter.ThisYear,
      startDate: startOfYear(today),
      endDate: endOfYear(today),
    },
  ];

  const { data: salesInsights } = useLocalApi({
    apiToCall: (data) => getSalesInsights(data.payload),
    payload: {
      dateFrom: appliedDateFilter
        ? appliedDateFilter?.startDate
        : pillOptions.find((pillOption) => pillOption.value == dateFilterPill)
            ?.startDate,
      dateTo: appliedDateFilter
        ? appliedDateFilter?.endDate
        : pillOptions.find((pillOption) => pillOption.value == dateFilterPill)
            ?.endDate,
    },
    effectDependency: [dateFilterPill, appliedDateFilter],
  }) as {
    data: SalesInsights;
  };

  // Format currency function
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Format weight function
  const formatWeight = (weight: number) => {
    return `${weight.toFixed(2)}g`;
  };

  return (
    <div id="sales-reports" className="page">
      <header className="headerFilter">
        <div className="dateFilters">
          <Stack direction="horizontal" gap={2}>
            {pillOptions.map((pill) => (
              <div
                key={pill.value}
                className={`dateFilterPill ${
                  dateFilterPill === pill.value ? " activePillFilter" : ""
                }`}
                onClick={() => {
                  setAppliedDateFilter(null);
                  setDateFilterPill(pill.value);
                }}
              >
                {pill.label}
              </div>
            ))}
          </Stack>
        </div>

        <div className="date-range mt-3">
          <DatePicker
            className="date-input"
            selected={startDate}
            onChange={(date) => {
              if (!!date && date > endDate) {
                const oneDayAfterDate = addDays(date, 1);
                setEndDate(oneDayAfterDate);
              }
              setStartDate(date);
            }}
          />
          <span style={{ color: "white" }}>to</span>
          <DatePicker
            className="date-input"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={addDays(startDate, 1)}
          />
          <button
            className="apply-btn"
            onClick={() => {
              setAppliedDateFilter({
                startDate: startDate,
                endDate: endDate,
              });
              setDateFilterPill(null);
            }}
          >
            Apply
          </button>
        </div>
      </header>

      {/* Summary of Sales Section - Integrated with API Data */}
      <section className="section">
        <h2 className="section-title">
          <FaChartBar className="icon" style={{ marginRight: "8px" }} /> Summary
          of Sales
        </h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Sales Amount</h3>
            <div className="amount">
              {salesInsights
                ? formatCurrency(salesInsights.totalSalesAmount)
                : "$0.00"}
            </div>
          </div>
          <div className="summary-card">
            <h3>Cash Amount Paid</h3>
            <div className="amount">
              {salesInsights
                ? formatCurrency(salesInsights.cashAmountPaid)
                : "$0.00"}
            </div>
          </div>
          <div className="summary-card">
            <h3>Card Amount Paid</h3>
            <div className="amount">
              {salesInsights
                ? formatCurrency(salesInsights.cardAmountPaid)
                : "$0.00"}
            </div>
          </div>
          <div className="summary-card gold">
            <h3>Discount Amount</h3>
            <div className="amount">
              {salesInsights
                ? formatCurrency(salesInsights.discountAmount)
                : "$0.00"}
            </div>
          </div>
        </div>
      </section>

      {/* Gold Sold by Karat Section - Integrated with API Data */}
      <section className="section">
        <h2 className="section-title">
          <FaWeightHanging className="icon" style={{ marginRight: "8px" }} />{" "}
          Gold Sold by Karat
        </h2>
        <div className="karat-cards">
          {salesInsights?.goldByKarat?.map((karatData) => (
            <div key={karatData.karatType} className="karat-card">
              <h3>{`${karatData.karatType}K Gold`}</h3>
              <div className="grams">{formatWeight(karatData.weight)}</div>
              <div className="price">
                {formatCurrency(karatData.pricePerGram)}/g
              </div>
              <div className="value">
                {formatCurrency(karatData.totalValue)}
              </div>
            </div>
          ))}

          {/* Fallback if no data */}
          {(!salesInsights?.goldByKarat ||
            salesInsights.goldByKarat.length === 0) && (
            <div className="karat-card">
              <h3>No Gold Sales Data</h3>
              <div className="grams">0g</div>
              <div className="price">$0.00/g</div>
              <div className="value">$0.00</div>
            </div>
          )}
        </div>
      </section>

      {/* Rest of your existing sections remain the same */}
      <section className="section">
        <h2 className="section-title">
          <FaShoppingCart className="icon" style={{ marginRight: "8px" }} />{" "}
          Items Sold
        </h2>
        <div className="filter-section">
          <select className="filter-select">
            <option>All Products</option>
            <option>Rings</option>
            <option>Necklaces</option>
            <option>Bracelets</option>
            <option>Earrings</option>
          </select>
          <select className="filter-select">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 3 Months</option>
            <option>Custom Range</option>
          </select>
          <select className="filter-select">
            <option>All Karats</option>
            <option>24K</option>
            <option>22K</option>
            <option>21K</option>
            <option>18K</option>
          </select>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Weight</th>
                <th>Price per Gram</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Diamond Solitaire Ring</td>
                <td>3</td>
                <td>3.5g</td>
                <td>$125.75</td>
                <td>$125.75</td>
                <td>$440.13</td>
              </tr>
              <tr>
                <td>Gold Tennis Bracelet</td>
                <td>2</td>
                <td>8.2g</td>
                <td>$112.30</td>
                <td>$112.30</td>
                <td>$920.68</td>
              </tr>
              <tr>
                <td>Ruby Heart Pendant</td>
                <td>4</td>
                <td>5.1g</td>
                <td>$142.90</td>
                <td>$142.90</td>
                <td>$728.79</td>
              </tr>
              <tr>
                <td>Emerald Drop Earrings</td>
                <td>1</td>
                <td>4.2g</td>
                <td>$132.50</td>
                <td>$132.50</td>
                <td>$556.50</td>
              </tr>
              <tr className="highlight">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>10</strong>
                </td>
                <td>
                  <strong>21.0g</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>$2,646.10</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          <FaUsers className="icon" style={{ marginRight: "8px" }} /> Customers
          Sold To
        </h2>
        <div className="filter-section">
          <input
            type="text"
            className="filter-select"
            placeholder="Search by customer name..."
          />
          <select className="filter-select">
            <option>All Customers</option>
            <option>New Customers</option>
            <option>Returning Customers</option>
          </select>
        </div>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Notes/Remarks</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john.doe@example.com</td>
                <td>(555) 123-4567</td>
                <td>Birthday gift for spouse</td>
                <td>
                  <ReceiptModal>
                    <button className="view-receipt-btn">View Receipt</button>
                  </ReceiptModal>
                </td>
              </tr>
              <tr>
                <td>Sarah Johnson</td>
                <td>sarah.j@example.com</td>
                <td>(555) 987-6543</td>
                <td>Anniversary present</td>
                <td>
                  <ReceiptModal>
                    <button className="view-receipt-btn">View Receipt</button>
                  </ReceiptModal>
                </td>
              </tr>
              <tr>
                <td>Michael Chen</td>
                <td>m.chen@example.com</td>
                <td>(555) 456-7890</td>
                <td>Custom engraving requested</td>
                <td>
                  <ReceiptModal>
                    <button className="view-receipt-btn">View Receipt</button>
                  </ReceiptModal>
                </td>
              </tr>
              <tr>
                <td>Emily Rodriguez</td>
                <td>emily.rod@example.com</td>
                <td>(555) 234-5678</td>
                <td>Preferred customer - 10% discount applied</td>
                <td>
                  <ReceiptModal>
                    <button className="view-receipt-btn">View Receipt</button>
                  </ReceiptModal>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default SalesReports;
