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
import { useState } from "react";
import { Stack } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { FaChartBar, FaWeightHanging } from "react-icons/fa";
import { getSalesInsights } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { DatePillFilter, KaratType } from "../../../types/enums";
import CustomersSoldTo from "./customersSoldTo/CustomersSoldTo";
import ItemsSoldTo from "./itemsSoldTo/ItemsSoldTo";
import "./salesReports.scss";

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
        <div className="filters-container">
          <div className="pills-row">
            <div className="pills-scroll-container">
              <Stack direction="horizontal" gap={2} className="pill-stack">
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
          </div>

          <div className="date-range-row">
            <div className="date-inputs-container">
              <div className="date-input-group">
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
                  placeholderText="Start Date"
                />
              </div>

              <span className="date-separator">to</span>

              <div className="date-input-group">
                <DatePicker
                  className="date-input"
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  minDate={addDays(startDate, 1)}
                  placeholderText="End Date"
                />
              </div>

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
          </div>
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
            <div className="amount">
              {salesInsights.totalSalesAmount
                ? formatCurrency(salesInsights.totalSalesAmount)
                : "$0.00"}
            </div>
          </div>
          <div className="summary-card">
            <h3>Cash Amount Paid</h3>
            <div className="amount">
              {salesInsights.cashAmountPaid
                ? formatCurrency(salesInsights.cashAmountPaid)
                : "$0.00"}
            </div>
          </div>
          <div className="summary-card">
            <h3>Card Amount Paid</h3>
            <div className="amount">
              {salesInsights.cardAmountPaid
                ? formatCurrency(salesInsights.cardAmountPaid)
                : "$0.00"}
            </div>
          </div>
          <div className="summary-card gold">
            <h3>Discount Amount</h3>
            <div className="amount">
              {salesInsights.discountAmount
                ? formatCurrency(salesInsights.discountAmount)
                : "$0.00"}
            </div>
          </div>
        </div>
      </section>

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

      <ItemsSoldTo />

      <CustomersSoldTo />
    </div>
  );
};

export default SalesReports;
