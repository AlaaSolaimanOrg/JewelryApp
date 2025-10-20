import React, {
  useEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Button, Modal } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { MdError } from "react-icons/md";
import { getProductsByNfcIds } from "../../apis/products.api/products.api";
import { renderTooltip } from "../../utils";
import "./scanModal.scss";

interface ScanModalProps {
  show: boolean;
  onClose: () => void;
  setProducts: Dispatch<SetStateAction<any>>;
  products: any[];
  scanOnly?: boolean;
  setScannedNfcIds?: Dispatch<SetStateAction<any>>;
}

const ScanModal: React.FC<ScanModalProps> = ({
  show,
  onClose,
  products,
  setProducts,
  scanOnly = false,
  setScannedNfcIds,
}) => {
  const handleClearAll = () => {
    setScannedItems([]);
  };
  const [scanInput, setScanInput] = useState("");
  const [scannedItems, setScannedItems] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<any>([]);

  // Simulate NFC scan (replace with actual NFC reader logic)
  const handleScanInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const addedNfcId = scanInput.trim();
    const checkListHasAddedNfcId = scannedItems.some(
      (scannedItem) => scannedItem == addedNfcId
    );

    if (e.key === "Enter" && addedNfcId !== "") {
      if (checkListHasAddedNfcId) {
        setScanInput("");
        return;
      }
      setValidationErrors([]);
      setScannedItems([...scannedItems, addedNfcId]);
      setScanInput("");
    }
  };

  const handleRemove = (nfcId: string) => {
    setScannedItems(
      scannedItems.filter((scannedItem) => scannedItem !== nfcId)
    );
  };

  // Helper function for validation
  function validateProducts(nfcIds: string[], fetchedProducts: any[]) {
    const productsWithNoQuantity = fetchedProducts.filter(
      (product) => !product.quantity || product.quantity <= 0
    );

    const nonExistentNfcIds = nfcIds.filter(
      (nfcId) => !fetchedProducts.some((product) => product.nfcId === nfcId)
    );

    const quantityErrors = productsWithNoQuantity.map((product) => ({
      nfcId: product.nfcId,
      errorMessage: "This product has no quantity",
    }));

    const notFoundErrors = nonExistentNfcIds.map((nfcId) => ({
      nfcId,
      errorMessage: "Product not found",
    }));

    const allErrors = [...quantityErrors, ...notFoundErrors];
    return allErrors;
  }

  async function getProductsByNfcIdsApi(nfcIds: string[]): Promise<void> {
    const response = await getProductsByNfcIds({ nfcIds });
    const fetchedProducts = response?.data || [];

    console.log("nfcIds", nfcIds);
    console.log("fetchedProducts", fetchedProducts);

    const newValidationErrors = validateProducts(nfcIds, fetchedProducts);

    console.log("newValidationErrors", newValidationErrors);
    console.log("validationErrors", validationErrors);
    if (newValidationErrors.length && !validationErrors.length) {
      setValidationErrors(newValidationErrors);
      return;
    }

    if (validationErrors.length > 0) {
      console.log("Products with errors:", validationErrors);
    }

    const updatedFetchedProducts = fetchedProducts.map((fetchedProduct) => ({
      ...fetchedProduct,
      originalPricePerGram: fetchedProduct.pricePerGram,
    }));

    const existingNfcIds = products.map((p) => p.nfcId);
    const newProducts = updatedFetchedProducts
      .filter((p) => !existingNfcIds.includes(p.nfcId) && p.quantity > 0)
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
    if (setScannedNfcIds) {
      setScannedNfcIds(scannedItems);
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
        <Modal.Title>NFC Scan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scan-section">
          <div className="scan-input-row">
            <input
              type="text"
              className="scan-input"
              placeholder="Scan NFC or enter code..."
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
                  <span className="item-title">SKU</span>
                </div>

                {scannedItems.map((scannedItem, idx) => {
                  const error = validationErrors.find(
                    (error: any) => error.nfcId === scannedItem
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
              getProductsByNfcIdsApi(scannedItems);
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
