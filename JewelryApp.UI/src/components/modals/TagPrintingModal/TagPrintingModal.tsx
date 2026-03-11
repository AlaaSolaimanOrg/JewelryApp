import React, { useEffect, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { FaPrint } from "react-icons/fa";
import type { Product } from "../../../pages/admin/inventory/Inventory";
import "./tagPrintingModal.scss";

import { showError, showSuccess } from "../../../utils";
import { DYMO, updateLabelXml } from "./dymoApi";

interface TagPrintingModalProps {
  show: boolean;
  onClose: () => void;
  product: Product | null;
}

const TagPrintingModal: React.FC<TagPrintingModalProps> = ({
  show,
  onClose,
  product,
}) => {
  const [tagCount, setTagCount] = useState(1);
  const [printers, setPrinters] = useState<any[]>([]);
  const [selectedPrinter, setSelectedPrinter] = useState("");
  const [dymoStatus, setDymoStatus] = useState({
    installed: false,
    version: "",
    initialized: false,
  });
  const [isLoadingPrinters, setIsLoadingPrinters] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  /* ---------------------------------------------
     On modal open → check DYMO + load printers
  ---------------------------------------------- */
  useEffect(() => {
    if (show) {
      checkEnvironment();
      loadPrinters();
    }
  }, [show]);

  if (!product) return null;

  /* ---------------------------------------------
     Check DYMO Connect status (REST API)
  ---------------------------------------------- */
  const checkEnvironment = async () => {
    const env = await DYMO.checkEnvironment();
    setDymoStatus({
      installed: env.isFrameworkInstalled,
      version: "REST Mode",
      initialized: env.isFrameworkInstalled,
    });
  };

  /* ---------------------------------------------
     Load printers
  ---------------------------------------------- */
  const loadPrinters = async () => {
    setIsLoadingPrinters(true);

    try {
      const list = await DYMO.getPrinters();
      setPrinters(list);

      if (list.length > 0) {
        setSelectedPrinter(list[0].name);
      } else {
        showError("No DYMO printers detected.");
      }
    } catch (err) {
      console.error("Error loading printers:", err);
      showError("Failed to load DYMO printers.");
    }

    setIsLoadingPrinters(false);
  };

  /* ---------------------------------------------
     Test Printer
  ---------------------------------------------- */
  const testDymoConnection = async () => {
    const env = await DYMO.checkEnvironment();
    if (!env.isFrameworkInstalled) {
      showError("DYMO Connect service is not running.");
      return;
    }

    const list = await DYMO.getPrinters();
    if (list.length === 0) {
      showError("No DYMO printers found.");
      return;
    }

    let msg = "Connected DYMO Printers:\n";
    list.forEach((p: any, i: number) => {
      msg += `${i + 1}. ${p.name}\n`;
    });

    showSuccess(msg);
  };

  /* ---------------------------------------------
     PRINT HANDLER
  ---------------------------------------------- */
  const handlePrint = async () => {
    if (!selectedPrinter) {
      showError("Please select a printer.");
      return;
    }

    setIsPrinting(true);

    try {
      // Load the .label file
      const response = await fetch(
        `${import.meta.env.VITE_ROUTE_PREFIX}labels/jewelry.label`,
      );
      const xml = await response.text();

      const updatedXml = updateLabelXml(xml, product);

      // Print X copies
      await DYMO.printMultipleCopies(selectedPrinter, updatedXml, tagCount);

      showSuccess(`Printed ${tagCount} tag(s) successfully.`);
    } catch (err) {
      console.error("PRINT ERROR:", err);
      showError("Printing failed. Check console.");
    }

    setIsPrinting(false);
  };

  /* ---------------------------------------------
     UI
  ---------------------------------------------- */
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      className="tag-printing-modal-wrapper"
    >
      <Modal.Header closeButton>
        <Modal.Title>Print Butterfly Tags — {product.sku}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="settings-section">
          <h6 className="section-title">Print Settings</h6>

          {/* DYMO STATUS */}
          <div className="dymo-status mb-3">
            <div className="status-item">
              <span>DYMO Service:</span>
              <span
                className={
                  dymoStatus.installed ? "text-success" : "text-danger"
                }
              >
                {dymoStatus.installed ? "✓ Running" : "✗ Not Running"}
              </span>
            </div>
            <div className="status-item">
              <span>Mode:</span>
              <span className="text-info">REST API</span>
            </div>
          </div>

          {/* PRINTER SELECTION */}
          <div className="control-group">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="control-label">Printer</label>
              <button
                className="btn btn-sm btn-outline-secondary"
                onClick={loadPrinters}
                disabled={isLoadingPrinters}
              >
                Refresh
              </button>
            </div>

            {isLoadingPrinters ? (
              <Spinner size="sm" />
            ) : (
              <Form.Select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
              >
                {printers.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>

          {/* TAG COUNT */}
          <div className="control-group">
            <label className="control-label">Number of Tags</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={1}
              max={300}
              value={tagCount}
              onChange={(e) => setTagCount(Number(e.target.value))}
            />
          </div>

          {/* PRODUCT INFO */}
          <div className="info-text">
            <div className="d-flex justify-content-between">
              <small>
                SKU: <strong>{product.sku}</strong>
              </small>
              <small>
                Price: <strong>${product.price?.toFixed(2)}</strong>
              </small>
            </div>
            <div className="d-flex justify-content-between mt-1">
              <small>
                Weight: <strong>{product.weight}g</strong>
              </small>
              <small>
                Karat: <strong>{product.karatType}K</strong>
              </small>
            </div>
          </div>

          {/* TEST BUTTON */}
          <button
            className="btn btn-outline-info mt-3 w-100"
            onClick={testDymoConnection}
          >
            Test DYMO Connection
          </button>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Cancel
        </button>

        <button className="btn btn-primary btn-gold" onClick={handlePrint}>
          {isPrinting ? (
            <>
              <Spinner size="sm" className="me-2" /> Printing...
            </>
          ) : (
            <>
              <FaPrint className="me-2" /> Print {tagCount} Tag(s)
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TagPrintingModal;
