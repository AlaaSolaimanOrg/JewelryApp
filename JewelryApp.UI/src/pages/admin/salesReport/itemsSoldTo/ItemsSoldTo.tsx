import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaShoppingCart } from "react-icons/fa";
import { getSoldItems } from "../../../../apis/sales.api/sales.api";
import Paginator from "../../../../components/Paginator/Paginator";

import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import {
  KaratType,
  ProductCategory,
  SortDirection,
} from "../../../../types/enums";
import "./itemsSoldTo.scss";
import type { TableHeader } from "../../../../components/tables/Table/CustomTable";
import CustomTable from "../../../../components/tables/Table/CustomTable";
import dateFormat from "dateformat";
import { handleSort } from "../../../../utils";

interface SoldItem {
  sku?: string;
  productName: string;
  customerName: string;
  saleSerialNumber: string;
  quantity: number;
  unitWeight: number;
  weightSummed: number;
  pricePerGram: number;
  subtotal: number;
  latestSaleDate: Date;
}

const ItemsSoldTo = () => {
  const [productCategoryFilter, setProductCategoryFilter] = useState<
    ProductCategory | ""
  >("");
  const [karatTypeFilter, setKaratTypeFilter] = useState<KaratType | "">("");
  const [dateFrom, setDateFrom] = useState<any>(null);
  const [dateTo, setDateTo] = useState<any>(null);
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

  const formatDateTime = (d: Date | null) => {
    if (!d) return null;
    return dateFormat(d, "yyyy-mm-dd HH:MM:ss");
  };
  const {
    data: soldItems,
    onPaginationChange,
    onPageSizeChange,
    onSortChange,
    onSearchChange,
    sortCriteria,
    pagination,
    isLoading,
  } = useLocalApiSearchSortPagination<SoldItem>({
    apiToCall: (data) => getSoldItems(data.payload),
    initialPageSize: 5,
    initialSortBy: "CreatedDate",
    initialSortDirection: SortDirection.Descending,
    extraPayload: {
      karatFilter: karatTypeFilter,
      categoryFilter: productCategoryFilter,
      dateFrom: formatDateTime(dateFrom),
      dateTo: formatDateTime(dateTo),
    },
    extraEffectDependency: [
      karatTypeFilter,
      timeRangeFilter,
      productCategoryFilter,
      dateFrom,
      dateTo,
    ],
  });

  // Define table headers
  const tableHeaders: TableHeader[] = [
    {
      key: "sku",
      label: "SKU",
      width: "12%",
      onHeaderClick: () =>
        handleSort("Product.Sku", sortCriteria, onSortChange),
    },
    {
      key: "productName",
      label: "Product Name",
      width: "18%",
      onHeaderClick: () =>
        handleSort("Product.Name", sortCriteria, onSortChange),
    },
    {
      key: "customerName",
      label: "Customer",
      width: "15%",
      onHeaderClick: () =>
        handleSort("Sale.Customer.Name", sortCriteria, onSortChange),
    },
    {
      key: "saleSerialNumber",
      label: "Sale ID",
      width: "12%",
      onHeaderClick: () =>
        handleSort("Sale.SerialNumber", sortCriteria, onSortChange),
    },
    {
      key: "quantity",
      label: "Quantity",
      width: "8%",
      onHeaderClick: () => handleSort("Quantity", sortCriteria, onSortChange),
    },
    {
      key: "weight",
      label: "Weight",
      width: "10%",
      onHeaderClick: () => handleSort("Weight", sortCriteria, onSortChange),
    },
    {
      key: "totalWeight",
      label: "Total Weight",
      width: "10%",
    },
    {
      key: "pricePerGram",
      label: "Price/g",
      width: "10%",
    },
    {
      key: "subtotal",
      label: "Subtotal",
      width: "10%",
      onHeaderClick: () => handleSort("SubTotal", sortCriteria, onSortChange),
    },
  ];

  // Transform soldItems data for CustomTable
  const tableData = soldItems.map((item) => ({
    sku: item.sku ?? "",
    productName: item.productName,
    customerName: item.customerName,
    saleSerialNumber: item.saleSerialNumber,
    quantity: item.quantity,
    weight: `${item.unitWeight}g`,
    totalWeight: `${item.weightSummed}g`,
    pricePerGram: `$${item.pricePerGram}`,
    subtotal: `$${item.subtotal}`,
  }));

  return (
    <section id="itemsSoldTo">
      <h2 className="section-title">
        <FaShoppingCart className="icon" style={{ marginRight: "8px" }} />
        Items Sold
      </h2>

      <div className="toolbar">
        <div className="search-bar">
          <FaSearch className="icon" />
          <input type="text" placeholder="Search" onChange={onSearchChange} />
        </div>

        <div className="filters">
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
            <option value={ProductCategory.Bangles}>Bangles</option>
            <option value={ProductCategory.Rings}>Rings</option>
            <option value={ProductCategory.Earrings}>Earrings</option>
            <option value={ProductCategory.Pendants}>Pendants</option>
            <option value={ProductCategory.Bullion}>Bullion</option>
          </select>

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

          <select
            className="filter-select"
            value={karatTypeFilter}
            onChange={(e) =>
              setKaratTypeFilter(e.target.value as KaratType | "")
            }
          >
            <option value="">All Karats</option>
            <option value={KaratType.Karat24}>24K</option>
            <option value={KaratType.Karat22}>22K</option>
            <option value={KaratType.Karat21}>21K</option>
            <option value={KaratType.Karat18}>18K</option>
          </select>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <div className="results-info">
        <p>
          Showing {soldItems.length} of {pagination.totalRecords} results
          {(productCategoryFilter || karatTypeFilter || dateFrom || dateTo) &&
            " (filtered)"}
        </p>
      </div>

      <CustomTable
        headers={tableHeaders}
        data={tableData}
        isLoading={isLoading}
      />

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
        onPageSizeChange={onPageSizeChange}
      />
    </section>
  );
};

export default ItemsSoldTo;
