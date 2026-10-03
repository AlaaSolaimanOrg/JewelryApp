import { FaEdit, FaReceipt } from "react-icons/fa";
import { getSoldItems } from "../../../../apis/sales.api";
import ReceiptModal from "../../../../components/modals/ReceiptModal/ReceiptModal";
import Paginator from "../../../../components/Paginator/Paginator";
import SortLabel from "../../../../components/tables/SortLabel/SortLabel";
import CustomTable from "../../../../components/tables/CustomTable/CustomTable";
import type { TableHeader } from "../../../../components/tables/CustomTable/CustomTable";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../../types/enums";
import { handleSort } from "../../../../utils";
import type { ItemsSoldToProps, SoldItem } from "./ItemsSoldTo.type";

const ItemsSoldTo = ({ range, onCorrectSale }: ItemsSoldToProps) => {
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
    extraPayload: range,
    extraEffectDependency: [range.reportType, range.dateFrom, range.dateTo],
  });

  const tableHeaders: TableHeader[] = [
    {
      key: "sku",
      label: <SortLabel label="SKU" field="Product.Sku" sortCriteria={sortCriteria} />,
      onHeaderClick: () =>
        handleSort("Product.Sku", sortCriteria, onSortChange),
    },
    {
      key: "productName",
      label: <SortLabel label="Product" field="Product.Name" sortCriteria={sortCriteria} />,
      onHeaderClick: () =>
        handleSort("Product.Name", sortCriteria, onSortChange),
    },
    {
      key: "customerName",
      label: <SortLabel label="Customer" field="Sale.Customer.Name" sortCriteria={sortCriteria} />,
      onHeaderClick: () =>
        handleSort("Sale.Customer.Name", sortCriteria, onSortChange),
    },
    {
      key: "saleSerialNumber",
      label: <SortLabel label="Sale ID" field="Sale.SerialNumber" sortCriteria={sortCriteria} />,
      onHeaderClick: () =>
        handleSort("Sale.SerialNumber", sortCriteria, onSortChange),
    },
    {
      key: "quantity",
      label: <SortLabel label="Qty" field="Quantity" sortCriteria={sortCriteria} />,
      align: "right",
      onHeaderClick: () => handleSort("Quantity", sortCriteria, onSortChange),
    },
    { key: "weight", label: "Weight", align: "right" },
    { key: "pricePerGram", label: "$/g", align: "right" },
    {
      key: "subtotal",
      label: <SortLabel label="Subtotal" field="SubTotal" sortCriteria={sortCriteria} />,
      align: "right",
      onHeaderClick: () => handleSort("SubTotal", sortCriteria, onSortChange),
    },
    { key: "receipt", label: "Receipt", align: "center" },
    ...(onCorrectSale
      ? [{ key: "payment", label: "Payment", align: "center" } as TableHeader]
      : []),
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
    receipt: (
      <ReceiptModal saleId={item.saleId}>
        <button className="receipt-btn">
          <FaReceipt /> View
        </button>
      </ReceiptModal>
    ),
    payment: onCorrectSale && (
      <button className="receipt-btn" onClick={() => onCorrectSale(item.saleId)}>
        <FaEdit /> Correct
      </button>
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
