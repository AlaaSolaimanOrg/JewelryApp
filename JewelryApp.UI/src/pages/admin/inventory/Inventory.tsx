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
  FaTrash,
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
import CustomTable, {
  type TableHeader,
} from "../../../components/Table/CustomTable";
import { API_URL } from "../../../config/config";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  KaratType,
  ProductCategory,
  type ProductType,
} from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./inventory.scss";
import ScanModal from "../../../components/ScanModal/ScanModal";
import { Stack } from "react-bootstrap";

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
  price: number;
  images: { imageUrl: string }[];
}

const Inventory = () => {
  const navigate = useNavigate();

  const [scannedNfcIds, setScannedNfcIds] = useState([]);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);
  const [showScanModal, setShowScanModal] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<InventoryFilters>({
    karatTypes: [
      KaratType.Karat18,
      KaratType.Karat21,
      KaratType.Karat22,
      KaratType.Karat24,
    ],
    weightFrom: 0,
    weightTo: 9999,
    priceFrom: 0,
    priceTo: 999999,
    category: null,
    // ringSize: "Any",
    // necklaceLength: "Any",
    // tags: [],
  });

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
      nfcIds: scannedNfcIds,
      karatTypeFilter: appliedFilters?.karatTypes,
      weightFromFilter: appliedFilters?.weightFrom,
      weightToFilter: appliedFilters?.weightTo,
      priceFromFilter: appliedFilters?.priceFrom,
      priceToFilter: appliedFilters?.priceTo,
      productCategoryFilter: appliedFilters?.category,
    },
    extraEffectDependency: [appliedFilters, scannedNfcIds],
  });

  const headers: TableHeader[] = [
    { key: "image", label: "Image", width: "100px" },
    { key: "productName", label: "Product Name", width: "250px" },
    { key: "price", label: "Price", width: "100px" },
    { key: "quantity", label: "Quantity", width: "100px" },
    { key: "sku", label: "SKU", width: "120px" },
    { key: "karat", label: "Karat", width: "80px" },
    { key: "weight", label: "Weight", width: "100px" },
    { key: "category", label: "Category", width: "150px" },
    { key: "tags", label: "Tags", width: "150px" },
    { key: "actions", label: "Actions", width: "150px" },
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
    Price: product.price,
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

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/editProduct/${productId}`);
  };

  const handleDeleteProduct = (productId: string) => {
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
          {/* <button className="btn-md btn-gray">
            <FaExchangeAlt className="me-1" /> Stock In/Out
          </button>
          <button className="btn-md btn-gray">
            <FaTags className="me-1" /> Print Tags
          </button>
          <button className="btn-md btn-gray">
            <FaFileExport className="me-1" /> Export
          </button> */}
        </div>
      </div>

      <div className="inventory-grid">
        <InventoryFilterSideBar setAppliedFilters={setAppliedFilters} />

        <div className="inventory-content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                Inventory Items ({pagination.totalRecords ?? 0})
              </h3>
              <Stack direction="horizontal" gap={4}>
                <div className="search-bar" style={{ width: "250px" }}>
                  <FaSearch className="icon me-1" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    onChange={onSearchChange}
                  />
                </div>

                {scannedNfcIds.length ? (
                  <button
                    className="scan-btn"
                    onClick={() => {
                      setScannedNfcIds([]);
                    }}
                  >
                    Reset Scanner
                  </button>
                ) : (
                  <button
                    className="scan-btn"
                    onClick={() => {
                      setShowScanModal(true);
                    }}
                  >
                    Scan Product
                  </button>
                )}
              </Stack>
            </div>

            <CustomTable data={data} headers={headers} />

            <Paginator
              totalRecords={pagination.totalRecords}
              pageNumber={pagination.pageNumber}
              pageSize={pagination.pageSize}
              onPaginationChange={onPaginationChange}
            />
          </div>
        </div>
      </div>

      <ScanModal
        show={showScanModal}
        onClose={() => setShowScanModal(false)}
        products={products}
        setProducts={() => {}}
        scanOnly
        setScannedNfcIds={setScannedNfcIds}
      />
      <LoadingScreen isLoading={isLoadingProducts || isDeletingProduct} />
    </div>
  );
};

export default Inventory;
