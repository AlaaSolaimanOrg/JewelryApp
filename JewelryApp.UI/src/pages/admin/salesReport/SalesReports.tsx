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
import { addDays, endOfMonth, endOfWeek, endOfYear } from "date-fns";
import { DatePillFilter } from "../../../types/enums";

const SalesReports = () => {
  const [startDate, setStartDate] = useState<any>(new Date());
  const [endDate, setEndDate] = useState<any>(new Date());

  const [dateFilterPill, setDateFilterPill] = useState<DatePillFilter | null>(
    null
  );

  const today = new Date();

  const pillOptions = [
    {
      label: "Today",
      value: DatePillFilter.Today,
      endDate: addDays(today, 1),
    },
    {
      label: "This Week",
      value: DatePillFilter.ThisWeek,
      endDate: endOfWeek(today, { weekStartsOn: 1 }),
    },
    {
      label: "This Month",
      value: DatePillFilter.ThisMonth,
      endDate: endOfMonth(today),
    },
    {
      label: "This Year",
      value: DatePillFilter.ThisYear,
      endDate: endOfYear(today),
    },
  ];

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
                onClick={() => setDateFilterPill(pill.value)}
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
            minDate={new Date()}
          />
          <span style={{ color: "white" }}>to</span>
          <DatePicker
            className="date-input"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            minDate={startDate}
          />
          <button className="apply-btn">Apply</button>
        </div>
      </header>

      <section className="section">
        <h2 className="section-title">
          <FaChartBar className="icon" style={{ marginRight: "8px" }} /> Summary
          of Sales
        </h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Total Sales Amount</h3>
            <div className="amount">$12,458.75</div>
          </div>
          <div className="summary-card">
            <h3>Cash Amount Paid</h3>
            <div className="amount">$7,325.50</div>
          </div>
          <div className="summary-card">
            <h3>Card Amount Paid</h3>
            <div className="amount">$5,133.25</div>
          </div>
          <div className="summary-card gold">
            <h3>Discount Amount</h3>
            <div className="amount">$625.40</div>
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">
          <FaWeightHanging className="icon" style={{ marginRight: "8px" }} />{" "}
          Gold Sold by Karat
        </h2>
        <div className="karat-cards">
          <div className="karat-card">
            <h3>24K Gold</h3>
            <div className="grams">42.5g</div>
            <div className="price">$142.90/g</div>
            <div className="value">$6,073.25</div>
          </div>
          <div className="karat-card">
            <h3>22K Gold</h3>
            <div className="grams">28.3g</div>
            <div className="price">$132.50/g</div>
            <div className="value">$3,749.75</div>
          </div>
          <div className="karat-card">
            <h3>21K Gold</h3>
            <div className="grams">35.7g</div>
            <div className="price">$125.75/g</div>
            <div className="value">$4,489.28</div>
          </div>
          <div className="karat-card">
            <h3>18K Gold</h3>
            <div className="grams">52.1g</div>
            <div className="price">$112.30/g</div>
            <div className="value">$5,851.83</div>
          </div>
        </div>
      </section>

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
