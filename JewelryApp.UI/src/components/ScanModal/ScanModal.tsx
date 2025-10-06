import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import "./scanModal.scss";

interface ScanModalProps {
  show: boolean;
  onClose: () => void;
}

interface ScannedItem {
  id: string;
  data: string;
}

const ScanModal: React.FC<ScanModalProps> = ({ show, onClose }) => {
  const [scanInput, setScanInput] = useState("");
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([]);

  // Simulate NFC scan (replace with actual NFC reader logic)
  const handleScanInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && scanInput.trim() !== "") {
      const newItem: ScannedItem = {
        id: Math.random().toString(36).substr(2, 9),
        data: scanInput.trim(),
      };
      setScannedItems([...scannedItems, newItem]);
      setScanInput("");
    }
  };

  const handleRemove = (id: string) => {
    setScannedItems(scannedItems.filter((item) => item.id !== id));
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
            {scannedItems.map((item) => (
              <li key={item.id} className="scanned-item">
                <span className="item-data">{item.data}</span>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleRemove(item.id)}
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
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ScanModal;
