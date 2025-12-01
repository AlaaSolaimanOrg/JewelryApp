import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Button, Modal } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { MdError } from "react-icons/md";
import { getProductsBySkus } from "../../../apis/products.api/products.api";
import { renderTooltip } from "../../../utils";
import "./scanModal.scss";

interface ScanModalProps {
  show: boolean;
  onClose: () => void;
  setProducts: Dispatch<SetStateAction<any>>;
  products: any[];
  scanOnly?: boolean;
  setScannedSkus?: Dispatch<SetStateAction<any>>;
}

const ScanModal: React.FC<ScanModalProps> = ({
  show,
  onClose,
  products,
  setProducts,
  scanOnly = false,
  setScannedSkus,
}) => {
  const handleClearAll = () => {
    setScannedItems([]);
  };
  const [scanInput, setScanInput] = useState("");
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>([]);

  const handleScanInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const addedSku = scanInput.trim();
    const checkListHasAddedSku = scannedItems.some(
      (scannedItem) => scannedItem == addedSku
    );

    if (e.key === "Enter" && addedSku !== "") {
      if (checkListHasAddedSku) {
        setScanInput("");
        return;
      }
      setValidationErrors([]);
      setScannedItems([...scannedItems, addedSku]);
      setScanInput("");
    }
  };

  const handleRemove = (sku: string) => {
    setScannedItems(
      scannedItems.filter((scannedItem) => scannedItem !== sku)
    );
  };

  // Helper function for validation
  function validateProducts(skus: string[], fetchedProducts: any[]) {
    const productsWithNoQuantity = fetchedProducts.filter(
      (product) => !product.quantity || product.quantity <= 0
    );

    const nonExistentSkus = skus.filter(
      (sku) => !fetchedProducts.some((product) => product.sku === sku)
    );

    const quantityErrors = productsWithNoQuantity.map((product) => ({
      sku: product.sku,
      errorMessage: "This product has no quantity",
    }));

    const notFoundErrors = nonExistentSkus.map((sku) => ({
      sku,
      errorMessage: "Product not found",
    }));

    const allErrors = [...quantityErrors, ...notFoundErrors];
    return allErrors;
  }

  async function getProductsBySkusApi(skus: string[]): Promise<void> {
    const response = await getProductsBySkus({ skus });
    const fetchedProducts = response?.data || [];

    const newValidationErrors = validateProducts(skus, fetchedProducts);

    if (newValidationErrors.length && !validationErrors.length) {
      setValidationErrors(newValidationErrors);
      return;
    }

    const updatedFetchedProducts = fetchedProducts.map((fetchedProduct) => ({
      ...fetchedProduct,
      originalPricePerGram: fetchedProduct.pricePerGram,
      quantityForSale: 1,
    }));

    const existingSkus = products.map((p) => p.sku);
    const newProducts = updatedFetchedProducts
      .filter((p) => !existingSkus.includes(p.sku) && p.quantity > 0)
      .map((p) => ({ ...p, manual: false }));

    const updatedProducts = [...products, ...newProducts];
    const sortedProducts = updatedProducts.sort((a, b) => {
      if (a.manual === b.manual) return 0;
      return a.manual ? 1 : -1;
    });

    setProducts(sortedProducts);
    setScannedItems([]);
    onClose();
  }

  const saveFilters = () => {
    if (setScannedSkus) {
      setScannedSkus(scannedItems);
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      setScannedItems([]);
      setScanInput("");
    }
  }, [show]);

  return (
    <Modal show={show} onHide={onClose} centered className="scan-modal">
      <Modal.Header closeButton>
        <Modal.Title>SKU Scan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scan-section">
          <div className="scan-input-row">
            <input
              type="text"
              className="scan-input"
              placeholder="Scan SKU or enter code..."
              value={scanInput}
              onChange={(e) => setScanInput(e.target.value)}
              onKeyUp={handleScanInput}
              autoFocus
            />
            {scannedItems.length > 0 && (
              <button
                className="clear-all-btn"
                type="button"
                onClick={handleClearAll}
                title="Clear all scanned items"
              >
                Clear All
              </button>
            )}
          </div>
          <ul className="scanned-list">
            {scannedItems.length === 0 ? (
              <div className="no-scan-message">
                <span>No items have been scanned yet.</span>
              </div>
            ) : (
              <>
                <div className="sku-list-header">
                  <span className="item-title">Sku Id</span>
                </div>

                {scannedItems.map((scannedItem, idx) => {
                  const error = validationErrors.find(
                    (error: any) => error.sku === scannedItem
                  );

                  return (
                    <li key={scannedItem} className="scanned-item">
                      <div className="scan-row-content">
                        <span className="row-number">{idx + 1}.</span>
                        <span className="item-data" title={scannedItem}>
                          {scannedItem}
                        </span>
                        <span className="e-icon" title="Remove">
                          <BiTrash
                            style={{
                              fontSize: "1.5rem", // Reduced size to fit better
                              color: "var(--danger)",
                              cursor: "pointer",
                            }}
                            onClick={() => handleRemove(scannedItem)}
                          />
                        </span>
                        {!!error && (
                          <div
                            className="error-warning"
                            title="Validation error"
                          >
                            {renderTooltip(
                              <MdError className="errorIcon" />,
                              error.errorMessage
                            )}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}

                {validationErrors.length > 0 && (
                  <div className="validation-error-message">
                    <MdError className="error-icon" />
                    <span>
                      {validationErrors.length} item(s) have errors and will be
                      excluded from the final list.
                    </span>
                  </div>
                )}
              </>
            )}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={!scannedItems.length}
          onClick={() => {
            if (scanOnly) {
              saveFilters();
            } else {
              getProductsBySkusApi(scannedItems);
            }
          }}
        >
          {validationErrors.length ? "Proceed" : "Confirm"}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanModal;
