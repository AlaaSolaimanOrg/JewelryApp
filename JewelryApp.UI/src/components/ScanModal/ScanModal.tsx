import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./scanModal.scss";
import { showError } from "../../utils";

interface ScanModalProps {
  show: boolean;
  onClose: () => void;
}

const ScanModal: React.FC<ScanModalProps> = ({ show, onClose }) => {
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

  return (
    <Modal show={show} onHide={onClose} centered className="scan-modal">
      <Modal.Header closeButton>
        <Modal.Title>NFC Scan</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="scan-section">
          <input
            type="text"
            className="scan-input"
            placeholder="Scan NFC or enter code..."
            value={scanInput}
            onChange={(e) => setScanInput(e.target.value)}
            onKeyUp={handleScanInput}
            autoFocus
          />
          <ul className="scanned-list">
            {scannedItems.map((scannedItem) => (
              <li key={scannedItem} className="scanned-item">
                <span className="item-data">{scannedItem}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(scannedItem)}
                  className="remove-btn"
                >
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" disabled={!scannedItems.length}>Confirm</Button>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanModal;
