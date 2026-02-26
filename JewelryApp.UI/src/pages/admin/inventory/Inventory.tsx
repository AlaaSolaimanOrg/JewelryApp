import { useState } from "react";
import { Col, Row, Stack } from "react-bootstrap";
import {
  FaBox,
  FaEdit,
  FaFileExcel,
  FaPlus,
  FaPrint,
  FaSearch,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  exportProductsToExcel,
  getProducts,
} from "../../../apis/products.api/products.api";

import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import ScanModal from "../../../components/modals/ScanModal/ScanModal";
import TagPrintingModal from "../../../components/modals/TagPrintingModal/TagPrintingModal";
import Paginator from "../../../components/Paginator/Paginator";

import InventoryFilter, {
  type InventoryFilters,
} from "../../../components/InventoryFilter/InventoryFilter";
import type { TableHeader } from "../../../components/tables/Table/CustomTable";
import CustomTable from "../../../components/tables/Table/CustomTable";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  KaratType,
  ProductCategory,
  type ProductType,
} from "../../../types/enums";
import { handleSort, renderLongDescription } from "../../../utils";
import "./inventory.scss";
import TagsPopover from "./TagsPopover/TagsPopover";

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
  tags: string[];
  specification?: string;
  isManualEntry: boolean;
}

const Inventory = () => {
  const navigate = useNavigate();

  const [scannedSkus, setScannedSkus] = useState([]);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showTagPrintingModal, setShowTagPrintingModal] = useState(false);
  const [selectedProductForPrinting, setSelectedProductForPrinting] =
    useState<Product | null>(null);

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
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    sortCriteria,
    onSortChange,
    onSearchChange,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<Product>({
    apiToCall: (data) => getProducts(data.payload),
    extraPayload: {
      skus: scannedSkus,
      karatTypeFilter: appliedFilters?.karatTypes,
      weightFromFilter: appliedFilters?.weightFrom,
      weightToFilter: appliedFilters?.weightTo,
      priceFromFilter: appliedFilters?.priceFrom,
      priceToFilter: appliedFilters?.priceTo,
      productCategoryFilter: appliedFilters?.category,
    },
    extraEffectDependency: [appliedFilters, scannedSkus],
  });

  const headers: TableHeader[] = [
    { key: "image", label: "Image", width: "100px" },
    {
      key: "productName",
      label: "Product Name",
      width: "150px",
      onHeaderClick: () => {
        handleSort("Name", sortCriteria, onSortChange);
      },
    },
    {
      key: "price",
      label: "Price",
      width: "100px",
      sortable: false,
    },
    {
      key: "quantity",
      label: "Quantity",
      width: "100px",
      onHeaderClick: () => {
        handleSort("quantity", sortCriteria, onSortChange);
      },
    },
    {
      key: "sku",
      label: "SKU",
      width: "150px",
      onHeaderClick: () => {
        handleSort("sku", sortCriteria, onSortChange);
      },
    },

    {
      key: "karat",
      label: "Karat",
      width: "80px",
      onHeaderClick: () => {
        handleSort("KaratType", sortCriteria, onSortChange);
      },
    },
    {
      key: "weight",
      label: "Weight",
      width: "100px",
      onHeaderClick: () => {
        handleSort("weight", sortCriteria, onSortChange);
      },
    },
    {
      key: "category",
      label: "Category",
      width: "150px",
      onHeaderClick: () => {
        handleSort("category", sortCriteria, onSortChange);
      },
    },
    {
      key: "tags",
      label: "Tags",
      width: "80px",
    },
    { key: "actions", label: "Actions", width: "150px" },
  ];

  const data = products?.map((product) => ({
    image: !!product.images[0]?.imageUrl && (
      <img
        src={`${import.meta.env.VITE_API_URL}${product.images[0]?.imageUrl}`}
        alt={product.name ?? ""}
        style={{
          width: "70px",
          height: "70px",
          objectFit: "cover",
          borderRadius: "6px",
        }}
      />
    ),
    quantity: product.quantity,
    price: product.price,
    productName: renderLongDescription(product.name, 14),
    sku: product.sku,
    karat: `${product.karatType}K`,
    weight: `${product.weight}g`,
    category: ProductCategory[product.category],
    tags: <TagsPopover tags={product.tags} />,
    actions: (
      <div className="d-flex justify-content-end">
        {!product.isManualEntry && (
          <button
            className="action-btn"
            title="Print Tag"
            onClick={() => {
              setSelectedProductForPrinting(product);
              setShowTagPrintingModal(true);
            }}
          >
            <FaPrint />
          </button>
        )}
        <button
          className="action-btn"
          title="Edit"
          onClick={() => handleEditProduct(product.id)}
        >
          <FaEdit />
        </button>
        {/* <button
          className="action-btn danger"
          title="Delete"
          onClick={() => handleDeleteProduct(product.id)}
        >
          <FaTrash />
        </button> */}
      </div>
    ),
  }));

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/editProduct/${productId}`);
  };

  const handleExport = async () => {
    const payload = {
      skus: scannedSkus,
      karatTypeFilter: appliedFilters?.karatTypes,
      weightFromFilter: appliedFilters?.weightFrom,
      weightToFilter: appliedFilters?.weightTo,
      priceFromFilter: appliedFilters?.priceFrom,
      priceToFilter: appliedFilters?.priceTo,
      productCategoryFilter: appliedFilters?.category,
    };
    const response = await exportProductsToExcel(payload);

    // Create file download
    const blob = new Blob([response], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `Products_${new Date().toISOString().slice(0, 10)}.xlsx`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
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
            className="btn-md btn-success me-2"
            onClick={() => handleExport()}
          >
            <FaFileExcel className="me-1" />
            Export
          </button>
          <button
            className="btn-md btn-gold"
            onClick={() => {
              navigate("/admin/addProduct");
            }}
          >
            <FaPlus className="me-1" /> Add Product
          </button>
        </div>
      </div>

      <div>
        <Row>
          {/* Sidebar column - ALWAYS FIRST */}
          <Col xs={12} className="sidebar-column">
            <InventoryFilter setAppliedFilters={setAppliedFilters} />
          </Col>

          {/* Content column - ALWAYS SECOND */}
          <Col xs={12} className="content-column">
            <div className="inventory-content">
              <div className="card">
                <div className="card-header">
                  <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 w-100">
                    <h3 className="card-title mb-0">
                      Inventory Items ({pagination.totalRecords ?? 0})
                    </h3>

                    <Stack
                      direction="horizontal"
                      gap={4}
                      className="flex-wrap justify-content-end"
                    >
                      <div
                        className="search-bar"
                        style={{ minWidth: "250px", flex: "1 1 auto" }}
                      >
                        <FaSearch className="icon me-1" />
                        <input
                          type="text"
                          placeholder="Search inventory..."
                          onChange={onSearchChange}
                        />
                      </div>

                      {scannedSkus.length ? (
                        <button
                          className="scan-btn flex-shrink-0"
                          onClick={() => {
                            setScannedSkus([]);
                          }}
                        >
                          Reset Scanner
                        </button>
                      ) : (
                        <button
                          className="scan-btn flex-shrink-0"
                          onClick={() => {
                            setShowScanModal(true);
                          }}
                        >
                          Scan Product
                        </button>
                      )}
                    </Stack>
                  </div>
                </div>

                <CustomTable
                  data={data}
                  headers={headers}
                  isLoading={isLoadingProducts}
                />

                <Paginator
                  totalRecords={pagination.totalRecords}
                  pageNumber={pagination.pageNumber}
                  pageSize={pagination.pageSize}
                  onPaginationChange={onPaginationChange}
                />
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <ScanModal
        show={showScanModal}
        onClose={() => setShowScanModal(false)}
        products={products}
        setProducts={() => {}}
        scanOnly
        setScannedSkus={setScannedSkus}
      />
      <TagPrintingModal
        show={showTagPrintingModal}
        onClose={() => {
          setShowTagPrintingModal(false);
          setSelectedProductForPrinting(null);
        }}
        product={selectedProductForPrinting}
      />
    </div>
  );
};

export default Inventory;
