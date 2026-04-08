import { FaFire } from "react-icons/fa";
import { getMeltedProducts } from "../../../apis/products.api/products.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable from "../../../components/tables/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import { SortDirection } from "../../../types/enums";
import { renderLongDescription } from "../../../utils";
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
  const {
    data: products,
    isLoading,
    pagination,
    onPaginationChange,
    onPageSizeChange,
    onSortChange,
    sortCriteria,
  } = useLocalApiSearchSortPagination<MeltedProduct>({
    apiToCall: (data) => getMeltedProducts(data.payload),
    initialSortBy: "MeltedAt",
    initialSortDirection: SortDirection.Descending,
  });

  console.log("products", products);

  const headers = [
    { key: "meltedAt", label: "Melted At", width: "200px" },
    { key: "sku", label: "SKU", width: "150px" },
    { key: "productName", label: "Product Name", width: "200px" },
    { key: "quantity", label: "Quantity", width: "100px" },
    { key: "weight", label: "Weight (g)", width: "120px" },
    { key: "karat", label: "Karat", width: "100px" },
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
      </div>

      <div className="card">
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
