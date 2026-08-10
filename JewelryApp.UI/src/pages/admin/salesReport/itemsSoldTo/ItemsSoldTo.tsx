import { getSoldItems } from "../../../../apis/sales.api/sales.api";
import Paginator from "../../../../components/Paginator/Paginator";
import CustomTable from "../../../../components/tables/CustomTable/CustomTable";
import type { TableHeader } from "../../../../components/tables/CustomTable/CustomTable";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../../types/enums";
import { handleSort } from "../../../../utils";
import type { ItemsSoldToProps, SoldItem } from "./ItemsSoldTo.type";

const ItemsSoldTo = ({ dateFrom, dateTo }: ItemsSoldToProps) => {
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
    initialPageSize: 10,
    initialSortBy: "CreatedDate",
    initialSortDirection: SortDirection.Descending,
    extraPayload: { dateFrom, dateTo },
    extraEffectDependency: [dateFrom, dateTo],
  });

  const tableHeaders: TableHeader[] = [
    {
      key: "sku",
      label: "SKU",
      onHeaderClick: () =>
        handleSort("Product.Sku", sortCriteria, onSortChange),
    },
    {
      key: "productName",
      label: "Product",
      onHeaderClick: () =>
        handleSort("Product.Name", sortCriteria, onSortChange),
    },
    {
      key: "customerName",
      label: "Customer",
      onHeaderClick: () =>
        handleSort("Sale.Customer.Name", sortCriteria, onSortChange),
    },
    {
      key: "saleSerialNumber",
      label: "Sale ID",
      onHeaderClick: () =>
        handleSort("Sale.SerialNumber", sortCriteria, onSortChange),
    },
    {
      key: "quantity",
      label: "Qty",
      align: "right",
      onHeaderClick: () => handleSort("Quantity", sortCriteria, onSortChange),
    },
    { key: "weight", label: "Weight", align: "right" },
    { key: "pricePerGram", label: "$/g", align: "right" },
    {
      key: "subtotal",
      label: "Subtotal",
      align: "right",
      onHeaderClick: () => handleSort("SubTotal", sortCriteria, onSortChange),
    },
  ];

  const tableData = soldItems.map((item) => ({
    sku: <span className="mono">{item.sku ?? ""}</span>,
    productName: item.productName,
    customerName: item.customerName,
    saleSerialNumber: <span className="mono muted">{item.saleSerialNumber}</span>,
    quantity: item.quantity,
    weight: `${item.weightSummed}g`,
    pricePerGram: `$${item.pricePerGram}`,
    subtotal: (
      <span className="positive">
        $
        {item.subtotal.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </span>
    ),
  }));

  return (
    <div className="panel" id="itemsSoldTo">
      <div className="panel-head">
        <span className="panel-title">Items sold</span>
        <div className="panel-right">
          <input
            type="text"
            className="search-input"
            placeholder="Search item, SKU, customer..."
            onChange={onSearchChange}
          />
          <span className="panel-sub">
            {soldItems.length} of {pagination.totalRecords} rows
          </span>
        </div>
      </div>

      <div className="tbl-scroll">
        <CustomTable headers={tableHeaders} data={tableData} isLoading={isLoading} />
      </div>

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};

export default ItemsSoldTo;
