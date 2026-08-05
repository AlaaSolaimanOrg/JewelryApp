import React, { useEffect, useState } from "react";
import { Form, Spinner } from "react-bootstrap";
import { FaPrint, FaSyncAlt, FaTimes } from "react-icons/fa";
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

  if (!show || !product) return null;

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
    <div className="tag-printing-modal-wrapper mo" onClick={onClose}>
      <div className="mo-box wide" onClick={(e) => e.stopPropagation()}>
        <div className="mo-head">
          <span className="mo-title">
            <FaPrint /> Print butterfly tags —{" "}
            <span className="sku">{product.sku}</span>
          </span>
          <button className="mo-x" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="mo-body">
          <div className="info-strip">
            <div className="svc-row">
              <span>DYMO service:</span>
              <span className={dymoStatus.installed ? "svc-good" : "svc-bad"}>
                {dymoStatus.installed ? "✓ Running" : "✗ Not running"}
              </span>
            </div>
            <div className="svc-row">
              <span>Mode:</span>
              <span className="svc-mode">REST API</span>
            </div>
          </div>

          <div className="fg2">
            <label>
              Printer
              <button
                type="button"
                className="refresh-link"
                onClick={loadPrinters}
                disabled={isLoadingPrinters}
              >
                <FaSyncAlt /> Refresh
              </button>
            </label>

            {isLoadingPrinters ? (
              <Spinner size="sm" />
            ) : (
              <Form.Select
                value={selectedPrinter}
                onChange={(e) => setSelectedPrinter(e.target.value)}
              >
                {printers.length === 0 && (
                  <option value="">No printers found</option>
                )}
                {printers.map((p) => (
                  <option key={p.name} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </Form.Select>
            )}
          </div>

          <div className="fg2">
            <label>Number of tags</label>
            <Form.Control
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={1}
              max={300}
              value={tagCount}
              onChange={(e) => setTagCount(Number(e.target.value))}
            />
          </div>

          <div className="item-summary">
            <span>
              SKU: <b>{product.sku}</b>
            </span>
            <span>
              Price: <b>${product.price?.toFixed(2)}</b>
            </span>
            <span>
              Weight: <b>{product.weight}g</b>
            </span>
            <span>
              Karat: <b>{product.karatType}K</b>
            </span>
          </div>

          <button className="svc-link" onClick={testDymoConnection}>
            Test DYMO connection
          </button>
        </div>

        <div className="mo-foot">
          <button className="mo-btn mo-btn-dark" onClick={onClose}>
            Cancel
          </button>

          <button className="mo-btn mo-btn-gold" onClick={handlePrint}>
            {isPrinting ? (
              <>
                <Spinner size="sm" /> Printing...
              </>
            ) : (
              <>
                <FaPrint /> Print {tagCount} tag{tagCount !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TagPrintingModal;
