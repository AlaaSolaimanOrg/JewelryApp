import { useState } from "react";
import {
  FaBarcode,
  FaBox,
  FaFileExcel,
  FaPlus,
  FaPrint,
  FaSearch,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  exportProductsToExcel,
  getInventorySummary,
  getProducts,
  meltProduct,
  upsertProductSpecialPricing,
} from "../../../apis/products.api/products.api";
import { useAuth } from "../../../context/AuthContext";

import MeltModal from "../../../components/modals/MeltModal/MeltModal";
import ScanModal from "../../../components/modals/ScanModal/ScanModal";
import SpecialPricingModal from "../../../components/modals/SpecialPricingModal/SpecialPricingModal";
import TagPrintingModal from "../../../components/modals/TagPrintingModal/TagPrintingModal";
import Paginator from "../../../components/Paginator/Paginator";

import InventoryFilter, {
  type InventoryFilters,
} from "./InventoryFilter/InventoryFilter";
import CustomTable from "../../../components/tables/CustomTable/CustomTable";
import useLocalApi from "../../../hooks/useLocalApi";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
  KaratType,
  SortDirection,
  type ProductCategory,
  type ProductType,
} from "../../../types/enums";
import {
  checkRequestSucceeded,
  handleSort,
  showError,
  showSuccess,
} from "../../../utils";
import "./inventory.scss";
import {
  buildInventoryHeaders,
  buildInventoryTableData,
} from "./Inventory.utils";
import InventorySummary from "./InventorySummary/InventorySummary";
import type { InventorySummaryData } from "./InventorySummary/InventorySummary.type";

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
  createdDate?: string;
}

const Inventory = () => {
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  const isTerminalRole =
    !!userInfo?.roles?.includes("TerminalRole") &&
    !userInfo?.roles?.includes("Admin");

  const [scannedSkus, setScannedSkus] = useState([]);
  const [showScanModal, setShowScanModal] = useState(false);
  const [showTagPrintingModal, setShowTagPrintingModal] = useState(false);
  const [selectedProductForPrinting, setSelectedProductForPrinting] =
    useState<Product | null>(null);
  const [showMeltModal, setShowMeltModal] = useState(false);
  const [selectedProductForMelt, setSelectedProductForMelt] =
    useState<Product | null>(null);

  const [showSpecialPricingModal, setShowSpecialPricingModal] = useState(false);
  const [
    selectedProductForSpecialPricing,
    setSelectedProductForSpecialPricing,
  ] = useState<Product | null>(null);

  const [selectedSkus, setSelectedSkus] = useState<Set<string>>(new Set());

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
    inStock: null,
  });

  const {
    data: products,
    isLoading: isLoadingProducts,
    sortCriteria,
    onSortChange,
    onSearchChange,
    onPaginationChange,
    onPageSizeChange,
    pagination,
    fetchData,
  } = useLocalApiSearchSortPagination<Product>({
    apiToCall: (data) => getProducts(data.payload),
    extraPayload: {
      inStock: appliedFilters?.inStock ?? undefined,
      skus: scannedSkus,
      karatTypeFilter: appliedFilters?.karatTypes,
      weightFromFilter: appliedFilters?.weightFrom,
      weightToFilter: appliedFilters?.weightTo,
      priceFromFilter: appliedFilters?.priceFrom,
      priceToFilter: appliedFilters?.priceTo,
      productCategoryFilter: appliedFilters?.category,
    },
    extraEffectDependency: [appliedFilters, scannedSkus],
    initialSortBy: "createdDate",
    initialSortDirection: SortDirection.Descending,
  });

  const { data: inventorySummary, fetchData: fetchInventorySummary } =
    useLocalApi({
      apiToCall: (data) => getInventorySummary(data.payload),
      payload: {
        inStock: appliedFilters?.inStock ?? undefined,
        skus: scannedSkus,
        karatTypeFilter: appliedFilters?.karatTypes,
        weightFromFilter: appliedFilters?.weightFrom,
        weightToFilter: appliedFilters?.weightTo,
        priceFromFilter: appliedFilters?.priceFrom,
        priceToFilter: appliedFilters?.priceTo,
        productCategoryFilter: appliedFilters?.category,
      },
      effectDependency: [appliedFilters, scannedSkus],
      dataInitalValue: null,
    }) as { data: InventorySummaryData | null; fetchData: () => void };

  const toggleSelect = (sku: string) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      if (next.has(sku)) next.delete(sku);
      else next.add(sku);
      return next;
    });
  };

  const toggleAllOnPage = (checked: boolean) => {
    setSelectedSkus((prev) => {
      const next = new Set(prev);
      products?.forEach((p) =>
        checked ? next.add(p.sku) : next.delete(p.sku),
      );
      return next;
    });
  };

  const clearSelection = () => setSelectedSkus(new Set());

  const allOnPageSelected =
    !!products?.length && products.every((p) => selectedSkus.has(p.sku));

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/editProduct/${productId}`);
  };

  const handleMeltConfirm = async (productId: string, quantity: number) => {
    try {
      const payload = { productId, quantity };
      const response = await meltProduct(payload);

      if (response && checkRequestSucceeded(response.statusCode)) {
        showSuccess(
          response.message ??
            `${quantity} ${quantity === 1 ? "product" : "products"} melted successfully.`,
        );
        setShowMeltModal(false);
        setSelectedProductForMelt(null);
        if (fetchData) fetchData();
        fetchInventorySummary();
      } else {
        showError(response?.message ?? "Failed to melt product.");
      }
    } catch (err: any) {
      showError(err?.message ?? "Failed to melt product.");
    }
  };

  const handleSpecialPricingConfirm = async (
    productId: string,
    pricePerGram: number,
  ) => {
    try {
      const response = await upsertProductSpecialPricing({
        productId,
        specialPricePerGram: pricePerGram,
      });
      if (response && checkRequestSucceeded(response.statusCode)) {
        showSuccess("Special price updated successfully.");
        setShowSpecialPricingModal(false);
        setSelectedProductForSpecialPricing(null);
        if (fetchData) fetchData();
        fetchInventorySummary();
      } else {
        showError(response?.message ?? "Failed to update special price.");
      }
    } catch (err: any) {
      showError(err?.message ?? "Failed to update special price.");
    }
  };

  const handleExport = async (skusOverride?: string[]) => {
    const payload = {
      inStock: appliedFilters?.inStock ?? undefined,
      skus: skusOverride ?? scannedSkus,
      karatTypeFilter: appliedFilters?.karatTypes,
      weightFromFilter: appliedFilters?.weightFrom,
      weightToFilter: appliedFilters?.weightTo,
      priceFromFilter: appliedFilters?.priceFrom,
      priceToFilter: appliedFilters?.priceTo,
      productCategoryFilter: appliedFilters?.category,
    };
    const response = await exportProductsToExcel(payload);

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

  const handleBulkPrint = () => {
    const n = selectedSkus.size;
    showSuccess(`${n} tag${n !== 1 ? "s" : ""} sent to printer`);
    clearSelection();
  };

  const headers = buildInventoryHeaders(
    sortCriteria,
    onSortChange,
    allOnPageSelected,
    toggleAllOnPage,
  );
  const data = buildInventoryTableData(products ?? [], {
    isTerminalRole: !!isTerminalRole,
    selectedSkus,
    onToggleSelect: toggleSelect,
    onMelt: (p) => {
      setSelectedProductForMelt(p);
      setShowMeltModal(true);
    },
    onSpecialPrice: (p) => {
      setSelectedProductForSpecialPricing(p);
      setShowSpecialPricingModal(true);
    },
    onPrint: (p) => {
      setSelectedProductForPrinting(p);
      setShowTagPrintingModal(true);
    },
    onEdit: handleEditProduct,
  });

  return (
    <div id="inventory" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaBox className="icon" />
          <span>Inventory management</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-green" onClick={() => handleExport()}>
            <FaFileExcel /> Export to Excel
          </button>
          {!isTerminalRole && (
            <button
              className="btn-md btn-gold"
              onClick={() => navigate("/admin/addProduct")}
            >
              <FaPlus /> Add product
            </button>
          )}
        </div>
      </div>

      <InventoryFilter setAppliedFilters={setAppliedFilters} />

      <InventorySummary summary={inventorySummary} />

      {selectedSkus.size > 0 && (
        <div className="bulk-bar show">
          <span className="bulk-info">
            {selectedSkus.size} item{selectedSkus.size !== 1 ? "s" : ""}{" "}
            selected
          </span>
          <div className="bulk-actions">
            <button className="btn-md btn-gold" onClick={handleBulkPrint}>
              <FaPrint /> Print tags
            </button>
            <button
              className="btn-md btn-outline"
              onClick={() => handleExport(Array.from(selectedSkus))}
            >
              Export selected
            </button>
            <button className="btn-md btn-outline" onClick={clearSelection}>
              Clear
            </button>
          </div>
        </div>
      )}

      <div className="panel">
        <div className="tbl-head">
          <span className="tbl-title">
            Inventory items ({pagination.totalRecords ?? 0})
          </span>
          <div className="tbl-tools">
            <div className="search-wrap">
              <FaSearch className="search-ico" />
              <input
                type="text"
                className="search-input"
                placeholder="Search name, SKU, category..."
                onChange={onSearchChange}
              />
            </div>

            {scannedSkus.length ? (
              <button
                className="btn-md btn-outline"
                onClick={() => setScannedSkus([])}
              >
                Reset scanner
              </button>
            ) : (
              <button
                className="btn-md btn-gold"
                onClick={() => setShowScanModal(true)}
              >
                <FaBarcode /> Scan product
              </button>
            )}

            <button
              className="btn-md btn-outline"
              title="Sort by Date Added"
              onClick={() =>
                handleSort("createdDate", sortCriteria, onSortChange)
              }
            >
              {sortCriteria?.sortBy === "createdDate" &&
              sortCriteria?.sortDirection === SortDirection.Ascending ? (
                <FaSortAmountUp />
              ) : (
                <FaSortAmountDown />
              )}
              Date
            </button>
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
          onPageSizeChange={onPageSizeChange}
        />
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
      <MeltModal
        show={showMeltModal}
        onClose={() => {
          setShowMeltModal(false);
          setSelectedProductForMelt(null);
        }}
        product={selectedProductForMelt}
        onConfirm={handleMeltConfirm}
      />
      <SpecialPricingModal
        show={showSpecialPricingModal}
        onClose={() => {
          setShowSpecialPricingModal(false);
          setSelectedProductForSpecialPricing(null);
        }}
        product={selectedProductForSpecialPricing}
        onConfirm={handleSpecialPricingConfirm}
      />
    </div>
  );
};

export default Inventory;
