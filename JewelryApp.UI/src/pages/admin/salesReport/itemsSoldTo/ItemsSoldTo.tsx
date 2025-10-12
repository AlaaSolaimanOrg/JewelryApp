import { FaShoppingCart } from "react-icons/fa";
import Paginator from "../../../../components/Paginator/Paginator";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { getSoldItems } from "../../../../apis/sales.api/sales.api";
import "./itemsSoldTo.scss";
import { KaratType, ProductCategory } from "../../../../types/enums";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface SoldItem {
  productName: string;
  quantity: number;
  unitWeight: number;
  weightSummed: number;
  pricePerGram: number;
  subtotal: number;
  latestSaleDate: Date;
}

interface FilterPayload {
  CategoryFilter?: ProductCategory;
  KaratFilter?: KaratType;
  DateFrom?: Date;
  DateTo?: Date;
}

const ItemsSoldTo = () => {
  const [productCategoryFilter, setProductCategoryFilter] = useState<
    ProductCategory | ""
  >("");
  const [karatTypeFilter, setKaratTypeFilter] = useState<KaratType | "">("");
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [timeRangeFilter, setTimeRangeFilter] = useState<string>("");

  // Handle time range selection
  const handleTimeRangeChange = (range: string) => {
    setTimeRangeFilter(range);
    const today = new Date();

    switch (range) {
      case "last7days":
        setDateFrom(new Date(today.setDate(today.getDate() - 7)));
        setDateTo(new Date());
        break;
      case "last30days":
        setDateFrom(new Date(today.setDate(today.getDate() - 30)));
        setDateTo(new Date());
        break;
      case "last3months":
        setDateFrom(new Date(today.setMonth(today.getMonth() - 3)));
        setDateTo(new Date());
        break;
      case "allTime":
      default:
        setDateFrom(null);
        setDateTo(null);
        break;
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setProductCategoryFilter("");
    setKaratTypeFilter("");
    setDateFrom(null);
    setDateTo(null);
    setTimeRangeFilter("");
  };

  const {
    data: soldItems,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<SoldItem>({
    apiToCall: (data) => getSoldItems(data.payload),
    initialPageSize: 5,
    extraPayload: {
      karatTypeFilter: karatTypeFilter,
      categoryFilter: productCategoryFilter,
      dateFrom: dateFrom,
      dateTo: dateTo,
    },
    extraEffectDependency: [
      karatTypeFilter,
      timeRangeFilter,
      productCategoryFilter,
      dateFrom,
      dateTo,
    ],
  });

  return (
    <section id="itemsSoldTo">
      <h2 className="section-title">
        <FaShoppingCart className="icon" style={{ marginRight: "8px" }} />
        Items Sold
      </h2>

      {/* Filter Section */}
      <div className="filter-section">
        {/* Product Category Filter */}
        <select
          className="filter-select"
          value={productCategoryFilter}
          onChange={(e) =>
            setProductCategoryFilter(e.target.value as ProductCategory | "")
          }
        >
          <option value="">All Products</option>
          <option value={ProductCategory.Necklaces}>Necklaces</option>
          <option value={ProductCategory.Bracelets}>Bracelets</option>
          <option value={ProductCategory.Rings}>Rings</option>
          <option value={ProductCategory.Earrings}>Earrings</option>
          <option value={ProductCategory.Pendants}>Pendants</option>
          <option value={ProductCategory.Bullion}>Bullion</option>
        </select>

        {/* Time Range Filter */}
        <select
          className="filter-select"
          value={timeRangeFilter}
          onChange={(e) => handleTimeRangeChange(e.target.value)}
        >
          <option value="allTime">All Time</option>
          <option value="last7days">Last 7 Days</option>
          <option value="last30days">Last 30 Days</option>
          <option value="last3months">Last 3 Months</option>
          <option value="custom">Custom Range</option>
        </select>

        {/* Custom Date Range - Only show when custom is selected */}
        {timeRangeFilter === "custom" && (
          <div className="date-range-picker">
            <DatePicker
              selected={dateFrom}
              onChange={setDateFrom}
              selectsStart
              startDate={dateFrom}
              endDate={dateTo}
              placeholderText="Date From"
              className="filter-select"
            />
            <DatePicker
              selected={dateTo}
              onChange={setDateTo}
              selectsEnd
              startDate={dateFrom}
              endDate={dateTo}
              minDate={dateFrom}
              placeholderText="Date To"
              className="filter-select"
            />
          </div>
        )}

        {/* Karat Filter */}
        <select
          className="filter-select"
          value={karatTypeFilter}
          onChange={(e) => setKaratTypeFilter(e.target.value as KaratType | "")}
        >
          <option value="">All Karats</option>
          <option value={KaratType.Karat24}>24K</option>
          <option value={KaratType.Karat22}>22K</option>
          <option value={KaratType.Karat21}>21K</option>
          <option value={KaratType.Karat18}>18K</option>
        </select>

        {/* Clear Filters Button */}
        <button className="clear-filters-btn" onClick={clearFilters}>
          Clear Filters
        </button>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <p>
          Showing {soldItems.length} of {pagination.totalRecords} results
          {(productCategoryFilter || karatTypeFilter || dateFrom || dateTo) &&
            " (filtered)"}
        </p>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Weight</th>
              <th>Price per Gram</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pagination.totalRecords ? (
              soldItems.map((soldItem, index) => (
                <tr key={index}>
                  <td>{soldItem.productName}</td>
                  <td>{soldItem.quantity}</td>
                  <td>{soldItem.weightSummed}g</td>
                  <td>${soldItem.pricePerGram}</td>
                  <td>${soldItem.subtotal}</td>
                </tr>
              ))
            ) : (
              <tr className="noResultsFound">
                <td colSpan={5}>No results found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
      />
    </section>
  );
};

export default ItemsSoldTo;
