import { useState } from "react";
import { Card, Form } from "react-bootstrap";
import {
  FaChartBar,
  FaFire,
  FaList,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import {
  getMeltedProducts,
  getMeltedReports,
} from "../../../apis/products.api/products.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable from "../../../components/tables/Table/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../types/enums";
import { handleSort, renderLongDescription } from "../../../utils";
import "./meltedProducts.scss";

interface MeltedProduct {
  id: string;
  sku: string;
  productName?: string;
  quantity: number;
  weight?: number;
  karatType?: number | string;
  meltedAt?: string;
}

const MeltedProducts = () => {
  const [appliedDateRange, setAppliedDateRange] = useState<{
    dateFrom: string | null;
    dateTo: string | null;
  }>({ dateFrom: null, dateTo: null });

  const [dateRange, setDateRange] = useState<{
    dateFrom: string | null;
    dateTo: string | null;
  }>({ dateFrom: null, dateTo: null });

  const { data: meltedReports } = useLocalApi({
    apiToCall: (data) => getMeltedReports(data.payload),
    payload: {
      dateFrom: appliedDateRange.dateFrom,
      dateTo: appliedDateRange.dateTo,
    },
    effectDependency: [appliedDateRange],
  }) as { data: { melted?: any[]; Melted?: any[] } };

  const rawMeltedRows: any[] =
    meltedReports?.melted ?? meltedReports?.Melted ?? [];

  const meltedRows = [18, 21, 22, 24].map((karat) => {
    const found = rawMeltedRows.find(
      (r) => r.karatType === karat || r.KaratType === karat,
    );
    return {
      karatType: karat,
      itemCount: found?.itemCount ?? found?.ItemCount ?? 0,
      totalWeight: found?.totalWeight ?? found?.TotalWeight ?? 0,
    };
  });

  const handleApply = () =>
    setAppliedDateRange({
      dateFrom: dateRange.dateFrom,
      dateTo: dateRange.dateTo ? `${dateRange.dateTo}T23:59:59` : null,
    });
  const handleAllTime = () => {
    setDateRange({ dateFrom: null, dateTo: null });
    setAppliedDateRange({ dateFrom: null, dateTo: null });
  };

  const renderCards = (
    title: string,
    icon: React.ReactNode,
    rows: any[],
    accent?: "gold",
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
            <div className="sub-info">{(r.totalWeight ?? 0).toFixed(2)} g</div>
          </div>
        ))}
      </div>
    </div>
  );

  const {
    data: products,
    isLoading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onSortChange,
    onSearchChange,
    sortCriteria,
  } = useLocalApiSearchSortPagination<MeltedProduct>({
    apiToCall: (data) => getMeltedProducts(data.payload),
    initialSortBy: "MeltedAt",
    initialSortDirection: SortDirection.Descending,
  });

  const headers = [
    {
      key: "sku",
      label: "SKU",
      width: "150px",
      onHeaderClick: () => handleSort("Sku", sortCriteria, onSortChange),
    },
    {
      key: "productName",
      label: "Product Name",
      width: "200px",
      onHeaderClick: () =>
        handleSort("ProductName", sortCriteria, onSortChange),
    },
    {
      key: "quantity",
      label: "Quantity",
      width: "100px",
      onHeaderClick: () => handleSort("Quantity", sortCriteria, onSortChange),
    },
    {
      key: "weight",
      label: "Weight (g)",
      width: "120px",
      onHeaderClick: () => handleSort("Weight", sortCriteria, onSortChange),
    },
    {
      key: "karat",
      label: "Karat",
      width: "100px",
      onHeaderClick: () => handleSort("KaratType", sortCriteria, onSortChange),
    },
    {
      key: "meltedAt",
      label: "Melted At",
      width: "200px",
      onHeaderClick: () => handleSort("MeltedAt", sortCriteria, onSortChange),
    },
  ];

  const data = products?.map((p) => ({
    meltedAt: p.meltedAt ? new Date(p.meltedAt).toLocaleString() : "",
    sku: p.sku,
    productName: renderLongDescription(p.productName, 30),
    quantity: p.quantity,
    weight: p.weight ?? "",
    karat: p.karatType ? `${p.karatType}K` : "",
  }));

  return (
    <div id="melted-products" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaFire className="icon me-2" /> Melted Products
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

      <Card className="inventory-reports-wrapper mb-3">
        {renderCards(
          "Items Melted",
          <FaFire className="icon" />,
          meltedRows,
          "gold",
        )}
      </Card>

      <div className="card">
        <div className="table-header">
          <h5 className="section-title">
            <FaList className="icon" /> Melted Records
          </h5>
          <div className="table-actions">
            <div className="search-bar">
              <FaSearch className="icon" />
              <input
                type="text"
                placeholder="Search melted records..."
                onChange={onSearchChange}
              />
            </div>
            <button
              className="btn-md btn-gold"
              title={`Sort by Date ${
                sortCriteria.sortDirection === "Ascending"
                  ? "Descending"
                  : "Ascending"
              }`}
              onClick={() => handleSort("MeltedAt", sortCriteria, onSortChange)}
            >
              {sortCriteria.sortDirection === "Ascending" ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              )}
            </button>
          </div>
        </div>
        <CustomTable data={data} headers={headers} isLoading={isLoading} />

        <Paginator
          totalRecords={pagination.totalRecords}
          pageNumber={pagination.pageNumber}
          pageSize={pagination.pageSize}
          onPaginationChange={onPaginationChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
};

export default MeltedProducts;
