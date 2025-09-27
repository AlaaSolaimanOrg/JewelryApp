import { useState } from "react";
import {
  FaBox,
  FaEdit,
  FaExchangeAlt,
  FaFileExport,
  FaPlus,
  FaSearch,
  FaTag,
  FaTags,
  FaTrash
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  deleteProduct,
  getProducts,
} from "../../../apis/products.api/products.api";
import InventoryFilterSideBar, {
  type InventoryFilters,
} from "../../../components/InventoryFilterSideBar/InventoryFilterSideBar";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import Paginator from "../../../components/Paginator/Paginator";
import CustomTable from "../../../components/Table/CustomTable";
import { API_URL } from "../../../config/config";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  KaratType,
  ProductCategory,
  type ProductType,
} from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./inventory.scss";

export interface Product {
  id: string;
  sku: string;
  name?: string;
  karatType: KaratType;
  weight: number;
  category: ProductCategory;
  productType: ProductType;
  description?: string;
  pricePerGram?: number;
  quantity: number;
  images: { imageUrl: string }[];
}

const Inventory = () => {
  const navigate = useNavigate();

  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<InventoryFilters | null>(
    {
      karatTypes: [KaratType.Karat18, KaratType.Karat21,KaratType.Karat22, KaratType.Karat24],
      weight: 250,
      category: null,
      // ringSize: "Any",
      // necklaceLength: "Any",
      // tags: [],
    }
  );
  const {
    data: products,
    isLoading: isLoadingProducts,
    fetchData: recallGetProducts,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<Product>({
    apiToCall: (data) => getProducts(data.payload),
    extraPayload: {
      karatTypeFilter: appliedFilters?.karatTypes,
      weightFilter: appliedFilters?.weight,
      productCategoryFilter: appliedFilters?.category,
    },
    extraEffectDependency: [appliedFilters],
  });
  const headers = [
    "Image",
    "Product Name",
    "Quantity",
    "SKU",
    "Karat",
    "Weight",
    "Category",
    "Tags",
    "Actions",
  ];

  const data = products?.map((product) => ({
    Image: (
      <img
        src={`${API_URL}${product.images[0]?.imageUrl}`}
        alt={product.name ?? ""}
        style={{
          width: "40px",
          height: "40px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
    ),
    Quantity: product.quantity,
    ProductName: product.name,
    SKU: product.sku,
    Karat: `${product.karatType}K`,
    Weight: `${product.weight}g`,
    Category: ProductCategory[product.category],
    Actions: (
      <>
        <button
          className="action-btn"
          title="Edit"
          onClick={() => handleEditProduct(product.id)}
        >
          <FaEdit />
        </button>
        <button className="action-btn" title="Print Tag">
          <FaTag />
        </button>
        <button
          className="action-btn danger"
          title="Delete"
          onClick={() => handleDeleteProduct(product.id)}
        >
          <FaTrash />
        </button>
      </>
    ),
  }));

  const handleEditProduct = (productId) => {
    navigate(`/admin/editProduct/${productId}`);
  };

  const handleDeleteProduct = (productId) => {
    setIsDeletingProduct(true);

    const payload = { id: productId };
    deleteProduct(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          recallGetProducts();
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsDeletingProduct(false);
      });
  };

  return (
    <div id="inventory" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaBox className="icon me-2" />
          <span>Inventory Management</span>
        </h1>
        <div className="page-actions">
          <button
            className="btn-md btn-gold"
            onClick={() => {
              navigate("/admin/addProduct");
            }}
          >
            <FaPlus className="me-1" /> Add Product
          </button>
          <button className="btn-md btn-gray">
            <FaExchangeAlt className="me-1" /> Stock In/Out
          </button>
          <button className="btn-md btn-gray">
            <FaTags className="me-1" /> Print Tags
          </button>
          <button className="btn-md btn-gray">
            <FaFileExport className="me-1" /> Export
          </button>
        </div>
      </div>

      <div className="inventory-grid">
        {/* Sidebar */}
        <InventoryFilterSideBar setAppliedFilters={setAppliedFilters} />
        {/* Inventory Content */}
        <div className="inventory-content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Inventory Items (124)</h3>
              <div>
                <div className="search-bar" style={{ width: "250px" }}>
                  <FaSearch className="icon me-1" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    onChange={onSearchChange}
                  />
                </div>
              </div>
            </div>

            <CustomTable data={data} headers={headers} />

            <Paginator
              totalRecords={pagination.totalRecords}
              pageNumber={pagination.pageNumber}
              pageSize={pagination.pageSize}
              onPaginationChange={onPaginationChange}
            />
            {/* <div className="pagination">
              <div className="page-item active">1</div>
              <div className="page-item">2</div>
              <div className="page-item">3</div>
              <div className="page-item">4</div>
              <div className="page-item">5</div>
            </div> */}
          </div>

          {/* Summary */}
          {/* <div className="card">
            <div className="card-header">
              <h3 className="card-title">Inventory Summary</h3>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-title">Total Items</div>
                  <div className="kpi-icon">
                    <FaGem />
                  </div>
                </div>
                <div className="kpi-value">124</div>
                <div className="kpi-trend">
                  <FaArrowUp /> 8 new this week
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-title">Stock Value</div>
                  <div className="kpi-icon">
                    <FaDollarSign />
                  </div>
                </div>
                <div className="kpi-value">$892,350</div>
                <div className="kpi-trend down">
                  <FaArrowDown /> 2.1% from last month
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-title">Low Stock Items</div>
                  <div className="kpi-icon">
                    <FaExclamationTriangle />
                  </div>
                </div>
                <div className="kpi-value">7</div>
                <div className="kpi-trend">
                  <FaArrowUp /> Needs attention
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
      <LoadingScreen isLoading={isLoadingProducts || isDeletingProduct} />
    </div>
  );
};

export default Inventory;
