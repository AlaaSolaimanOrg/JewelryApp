import React, { useState, type Dispatch, type SetStateAction } from "react";
import { Button, Modal } from "react-bootstrap";
import { BiTrash } from "react-icons/bi";
import { getProductsBySku } from "../../apis/products.api/products.api";
import "./scanModal.scss";

interface ScanModalProps {
  show: boolean;
  onClose: () => void;
  setProducts: Dispatch<SetStateAction<any>>;
  products: any[];
}

const ScanModal: React.FC<ScanModalProps> = ({
  show,
  onClose,
  products,
  setProducts,
}) => {
  const handleClearAll = () => {
    setScannedItems([]);
  };
  const [scanInput, setScanInput] = useState("");
  const [scannedItems, setScannedItems] = useState<string[]>([]);

  // Simulate NFC scan (replace with actual NFC reader logic)
  const handleScanInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const addedSku = scanInput.trim();
    const checkListHasAddedSku = scannedItems.some(
      (scannedItem) => scannedItem == addedSku
    );

    if (e.key === "Enter" && addedSku !== "") {
      if (checkListHasAddedSku) {
        return;
      }
      setScannedItems([...scannedItems, addedSku]);
      setScanInput("");
    }
  };

  const handleRemove = (sku: string) => {
    setScannedItems(scannedItems.filter((scannedItem) => scannedItem !== sku));
  };

  async function getProductsBySkuApi(skus: string[]): Promise<void> {
    const response = await getProductsBySku({ skus });
    const fetchedProducts = response?.data || [];

    const updatedFetchedProducts = fetchedProducts.map((fetchedProduct) => {
      return {
        ...fetchedProduct,
        originalPricePerGram: fetchedProduct.pricePerGram,
      };
    });

    const existingSkus = products.map((p) => p.sku);
    const newProducts = updatedFetchedProducts
      .filter((p) => !existingSkus.includes(p.sku))
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

                {scannedItems.map((scannedItem, idx) => (
                  <li key={scannedItem} className="scanned-item">
                    <div className="scan-row-content">
                      <span className="row-number">{idx + 1}.</span>
                      <span className="item-data" title={scannedItem}>
                        {scannedItem}
                      </span>
                      <span className="e-icon" title="Remove">
                        <BiTrash
                          style={{
                            fontSize: "2rem",
                            color: "var(--danger)",
                            cursor: "pointer",
                          }}
                          onClick={() => handleRemove(scannedItem)}
                        />
                      </span>
                    </div>
                  </li>
                ))}
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
            getProductsBySkuApi(scannedItems);
          }}
        >
          Confirm
        </Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanModal;
