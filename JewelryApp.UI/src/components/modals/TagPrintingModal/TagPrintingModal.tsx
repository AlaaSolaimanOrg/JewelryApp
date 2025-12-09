import React, { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { Form, Modal, Spinner } from "react-bootstrap";
import { FaPrint } from "react-icons/fa";
import type { Product } from "../../../pages/admin/inventory/Inventory";
import "./tagPrintingModal.scss";

interface TagPrintingModalProps {
  show: boolean;
  onClose: () => void;
  product: Product | null;
}

interface TagConfig {
  scale: number;
}

// DYMO 3.0.0 Interfaces based on your window.dymo object
interface DymoPrinter {
  name: string;
  isConnected: boolean;
  isLocal: boolean;
  printerType: string;
}

interface DymoLabel {
  setObjectText: (objectName: string, text: string) => void;
  isValidLabel: () => boolean;
  isDCDLabel: () => boolean;
  isDLSLabel: () => boolean;
  print: (
    printerName: string,
    printParamsXml?: string,
    labelSetXml?: string
  ) => void;
  printAndPollStatus: (
    printerName: string,
    printParamsXml?: string,
    labelSetXml?: string
  ) => Promise<any>;
  getPrinters: () => string[];
}

interface DymoFramework {
  FlowDirection: {
    LeftToRight: string;
    RightToLeft: string;
  };
  LabelWriterPrintQuality: {
    Auto: string;
    Text: string;
    BarcodeAndGraphics: string;
  };
  TwinTurboRoll: {
    Auto: string;
    Left: string;
    Right: string;
  };
  TapeAlignment: {
    Center: string;
    Left: string;
    Right: string;
  };
  TapeCutMode: {
    AutoCut: string;
    ChainMarks: string;
  };
  AddressBarcodePosition: {
    AboveAddress: string;
    BelowAddress: string;
    Suppress: string;
  };
  PrintJobStatus: {
    [key: string]: number;
  };
  NetworkPrinter: any;
  trace: boolean;
  currentFramework: number;
  VERSION: string;

  // Methods
  init: () => Promise<void>;
  openLabelXml: (xml: string) => DymoLabel;
  openLabelFile: (fileName: string) => DymoLabel;
  getPrinters: () => DymoPrinter[];
  checkEnvironment: () => {
    isFrameworkInstalled: boolean;
    isBrowserSupported: boolean;
  };
  printLabel: (
    printerName: string,
    printParamsXml: string,
    labelXml: string,
    labelSetXml?: string
  ) => void;
  renderLabel: (
    labelXml: string,
    renderParamsXml: string,
    printerName: string
  ) => string;
  createLabelWriterPrintParamsXml: (params: {
    printerName?: string;
    numCopies?: number;
    labelSetXml?: string;
    printQuality?: string;
    twinTurboRoll?: string;
    flowDirection?: string;
  }) => string;
  getLabelWriterPrinters: () => DymoPrinter[];
}

interface DymoWindow extends Window {
  dymo?: {
    label: {
      framework: DymoFramework;
    };
  };
}

function updateLabelXml(xml: string, product: Product) {
  // Replace karatType inside TextObject1
  xml = xml.replace(
    /<TextObject>\s*<Name>TextObject1<\/Name>[\s\S]*?<TextSpan>[\s\S]*?<Text>([\s\S]*?)<\/Text>/,
    (match) =>
      match.replace(
        /<Text>[\s\S]*?<\/Text>/,
        `<Text>${product.karatType}k</Text>`
      )
  );

  // Replace weight inside TextObject12
  xml = xml.replace(
    /<TextObject>\s*<Name>TextObject12<\/Name>[\s\S]*?<TextSpan>[\s\S]*?<Text>([\s\S]*?)<\/Text>/,
    (match) =>
      match.replace(
        /<Text>[\s\S]*?<\/Text>/,
        `<Text>${product.weight} g</Text>`
      )
  );

  // Replace size inside TextObject2
  xml = xml.replace(
    /<TextObject>\s*<Name>TextObject2<\/Name>[\s\S]*?<TextSpan>[\s\S]*?<Text>([\s\S]*?)<\/Text>/,
    (match) =>
      match.replace(
        /<Text>[\s\S]*?<\/Text>/,
        `<Text>${product?.specification ?? ""}</Text>`
      )
  );

  // Replace barcode data inside BarcodeObject0
  xml = xml.replace(
    /<BarcodeObject>\s*<Name>BarcodeObject0<\/Name>[\s\S]*?<DataString>[\s\S]*?<\/DataString>/,
    (match) =>
      match.replace(
        /<DataString>[\s\S]*?<\/DataString>/,
        `<DataString>${product.sku}</DataString>`
      )
  );

  return xml;
}

async function printDymo(labelXml, printerName: string) {
  const params = new URLSearchParams();
  params.append("printerName", printerName);
  params.append("labelXml", labelXml);
  params.append("labelSetXml", "");
  params.append("printParamsXml", "");

  const res = await fetch(
    "https://127.0.0.1:41951/DYMO/DLS/Printing/PrintLabel",
    {
      method: "POST",
      body: params.toString(), // This is correct form encoding
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const text = await res.text();
}

const DEFAULT_CONFIG: TagConfig = {
  scale: 1,
};

const TagPrintingModal: React.FC<TagPrintingModalProps> = ({
  show,
  onClose,
  product,
}) => {
  const [tagCount, setTagCount] = useState<number>(1);
  const [config, setConfig] = useState<TagConfig>(DEFAULT_CONFIG);
  const [selectedPrinter, setSelectedPrinter] = useState<string>("");
  const [printers, setPrinters] = useState<DymoPrinter[]>([]);
  const [isLoadingPrinters, setIsLoadingPrinters] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [dymoStatus, setDymoStatus] = useState<{
    installed: boolean;
    supported: boolean;
    initialized: boolean;
    version: string;
  }>({
    installed: false,
    supported: false,
    initialized: false,
    version: "",
  });

  console.log("product", product);
  useEffect(() => {
    if (show) {
      checkDymoEnvironment();
      loadPrinters();
    }
  }, [show]);

  if (!product) return null;

  const checkDymoEnvironment = () => {
    const dymoWindow = window as DymoWindow;

    if (!dymoWindow.dymo) {
      setDymoStatus({
        installed: false,
        supported: false,
        initialized: false,
        version: "",
      });
      return;
    }

    try {
      const env = dymoWindow.dymo.label.framework.checkEnvironment();
      setDymoStatus({
        installed: env.isFrameworkInstalled,
        supported: env.isBrowserSupported,
        initialized: false,
        version: dymoWindow.dymo.label.framework.VERSION || "Unknown",
      });
    } catch (error) {
      console.error("Error checking DYMO environment:", error);
      setDymoStatus({
        installed: false,
        supported: false,
        initialized: false,
        version: "",
      });
    }
  };

  const loadPrinters = async () => {
    const dymoWindow = window as DymoWindow;

    if (!dymoWindow.dymo) {
      console.warn("DYMO framework not available");
      return;
    }

    setIsLoadingPrinters(true);
    try {
      // Initialize framework first
      await dymoWindow.dymo.label.framework.init();
      setDymoStatus((prev) => ({
        ...prev,
        initialized: true,
        version: dymoWindow.dymo!.label.framework.VERSION,
      }));

      // Get all printers
      const allPrinters = dymoWindow.dymo.label.framework.getPrinters();

      // Filter for connected printers
      const connectedPrinters = allPrinters.filter((p) => p.isConnected);
      setPrinters(connectedPrinters);

      // Auto-select first connected printer
      if (connectedPrinters.length > 0) {
        setSelectedPrinter(connectedPrinters[0].name);
      }
    } catch (error) {
      console.error("Error loading printers:", error);
      alert(
        "Failed to initialize DYMO framework. Make sure DYMO Connect is running."
      );
    } finally {
      setIsLoadingPrinters(false);
    }
  };

  const handleConfigChange = (key: keyof TagConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // ----------------------------------------
  // 🔍 TEST DYMO PRINTERS
  // ----------------------------------------
  const testDymoConnection = async () => {
    const dymoWindow = window as DymoWindow;

    if (!dymoWindow.dymo) {
      alert(
        "❌ DYMO Label Framework not detected.\nPlease make sure:\n1. DYMO Connect is installed\n2. The DYMO SDK script is loaded"
      );
      return;
    }

    try {
      await dymoWindow.dymo.label.framework.init();
      const printers = dymoWindow.dymo.label.framework.getPrinters();

      if (!printers || printers.length === 0) {
        alert(
          "❌ No DYMO printers detected.\nMake sure:\n1. Printer is connected via USB\n2. DYMO Connect is running\n3. Printer is turned on"
        );
        return;
      }

      const connectedPrinters = printers.filter((p) => p.isConnected);

      if (connectedPrinters.length === 0) {
        alert("❌ No connected DYMO printers found.");
        return;
      }

      let message = `✅ DYMO ${dymoWindow.dymo.label.framework.VERSION}\n`;
      message += `✅ ${connectedPrinters.length} printer(s) detected:\n\n`;
      connectedPrinters.forEach((printer, index) => {
        message += `${index + 1}. ${printer.name}\n   Type: ${
          printer.printerType
        }\n   Status: Connected\n\n`;
      });

      alert(message);
    } catch (err) {
      console.error("DYMO Test Error:", err);
      alert("❌ Could not access DYMO SDK. Make sure DYMO Connect is running.");
    }
  };

  async function printCopiesSequentially(
    labelXml: string,
    printerName: string,
    copies: number
  ) {
    for (let i = 0; i < copies; i++) {
      console.log(`Printing copy ${i + 1} of ${copies}`);

      // WAIT for printDymo to finish before sending next
      await printDymo(labelXml, printerName);

      // Optional: small delay for safety (DYMO gets overwhelmed easily)
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }

  // ----------------------------------------
  // 🖨 PRINT TAGS - UPDATED FOR DYMO 3.0.0
  // ----------------------------------------
  const handlePrint = async () => {
    if (!selectedPrinter) {
      alert("❌ Please select a printer first.");
      return;
    }

    const dymoWindow = window as DymoWindow;

    if (!dymoWindow.dymo) {
      alert("DYMO Label Framework not detected.");
      return;
    }

    setIsPrinting(true);

    try {
      // Initialize framework
      await dymoWindow.dymo.label.framework.init();

      // Load label template - MUST be a .label file, not .dymo
      let labelXml: string;
      try {
        const response = await fetch(
          `${import.meta.env.VITE_ROUTE_PREFIX}labels/jewelry.label`
        ); // Changed from .dymo
        if (!response.ok) {
          throw new Error(`Failed to load label template: ${response.status}`);
        }
        labelXml = await response.text();
      } catch (fetchError) {
        console.error("Failed to load label template:", fetchError);
        alert(
          "❌ Failed to load label template. Make sure jewelry.label exists."
        );
        return;
      }

      // Open label using the framework
      const label = dymoWindow.dymo.label.framework.openLabelXml(labelXml);

      // // Validate label
      // if (!label.isValidLabel()) {
      //   alert("❌ Invalid label format. Please use a .label file format.");
      //   return;
      // }

      // Set label content - use the correct object names from your label
      // label.setObjectText("TextObject1", product.sku); // Match your label's object names

      // Verify printer exists
      const printers = dymoWindow.dymo.label.framework.getPrinters();
      const printer = printers[selectedPrinter];

      if (!printer) {
        alert("❌ Selected printer is no longer available.");
        return;
      }

      const updatedLabelXml = updateLabelXml(labelXml, product);
      console.log("updatedLabelXml", updatedLabelXml);
      // Print the label
      // label.print(printer.name, printParamsXml);
      // printDymo(updatedLabelXml, printer.name);
      await printCopiesSequentially(updatedLabelXml, selectedPrinter, tagCount);

      alert(`✅ Sent ${tagCount} tag(s) to ${printer.name}.`);
    } catch (err) {
      console.error("PRINT ERROR:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      alert(
        `❌ Printing failed: ${errorMessage}\n\nCheck console for details.`
      );
    } finally {
      setIsPrinting(false);
    }
  };

  // Refresh printers list
  const refreshPrinters = () => {
    loadPrinters();
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="xl"
      className="tag-printing-modal-wrapper"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Print Butterfly Tags — {product.sku}
          {dymoStatus.version && (
            <small className="ms-2 text-muted">
              (DYMO {dymoStatus.version})
            </small>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="tag-modal-body">
        <div className="tag-modal-content">
          {/* PREVIEW SECTION */}
          <div className="preview-section">
            <h6 className="section-title">Tag Preview</h6>

            <div className="dymo-preview-container">
              <div
                className="dymo-jewelry-tag"
                style={{ transform: `scale(${config.scale})` }}
              >
                <div className="butterfly-tag">
                  <div className="tag-lobe left-lobe">
                    <Barcode
                      className="barCode"
                      value={product.sku}
                      height={180}
                      fontSize={40}
                    />
                  </div>
                  <div className="bridge"></div>
                  <div className="tag-lobe right-lobe">
                    <div className="tag-sku">{product.karatType}k</div>
                    <div className="tag-sku">{product.weight}g</div>
                    <div className="tag-sku">{product.specification}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SETTINGS SECTION */}
          <div className="settings-section">
            <h6 className="section-title">Print Settings</h6>

            {/* DYMO STATUS */}
            <div className="dymo-status mb-3">
              <div className="status-item">
                <span className="status-label">DYMO Connect:</span>
                <span
                  className={`status-value ${
                    dymoStatus.installed ? "text-success" : "text-danger"
                  }`}
                >
                  {dymoStatus.installed ? "✓ Installed" : "✗ Not Installed"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Framework:</span>
                <span className="status-value text-info">
                  v{dymoStatus.version || "Unknown"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Initialized:</span>
                <span
                  className={`status-value ${
                    dymoStatus.initialized ? "text-success" : "text-warning"
                  }`}
                >
                  {dymoStatus.initialized ? "✓ Ready" : "⚠ Not Ready"}
                </span>
              </div>
            </div>

            {/* PRINTER SELECTION */}
            <div className="control-group">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="control-label">Printer Selection</label>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={refreshPrinters}
                  disabled={isLoadingPrinters}
                >
                  {isLoadingPrinters ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Loading...
                    </>
                  ) : (
                    "Refresh"
                  )}
                </button>
              </div>
              {isLoadingPrinters ? (
                <div className="text-center py-2">
                  <Spinner animation="border" size="sm" className="me-2" />
                  Loading printers...
                </div>
              ) : printers.length > 0 ? (
                <Form.Select
                  value={selectedPrinter}
                  onChange={(e) => setSelectedPrinter(e.target.value)}
                  className={!selectedPrinter ? "border-warning" : ""}
                >
                  <option value="">Select a printer...</option>
                  {printers.map((printer) => (
                    <option
                      key={printer.name}
                      value={printer.name}
                      className={printer.isConnected ? "" : "text-muted"}
                    >
                      {printer.name}
                      {printer.printerType && ` (${printer.printerType})`}
                      {!printer.isConnected && " - Offline"}
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <div className="alert alert-warning p-2 mb-0">
                  <small>No connected DYMO printers found. Make sure:</small>
                  <ul className="mb-0 mt-1 ps-3">
                    <li>
                      <small>DYMO Connect is running</small>
                    </li>
                    <li>
                      <small>Printer is connected via USB</small>
                    </li>
                    <li>
                      <small>Printer is turned on</small>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            {/* TAG COUNT */}
            <div className="control-group">
              <label className="control-label">Number of Tags</label>
              <Form.Control
                type="number"
                min={1}
                max={300}
                value={tagCount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value >= 1 && value <= 300) {
                    setTagCount(value);
                  }
                }}
              />
              <div className="form-text">Enter a number between 1 and 300</div>
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

            {/* ACTION BUTTONS */}
            <div className="d-grid gap-2 mt-3">
              <button
                className="btn btn-outline-info"
                onClick={testDymoConnection}
                disabled={isPrinting}
              >
                Test DYMO Connection
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn btn-secondary"
          onClick={onClose}
          disabled={isPrinting}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary btn-gold"
          onClick={handlePrint}
          // disabled={!selectedPrinter || !dymoStatus.installed || isPrinting}
        >
          {isPrinting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              Printing {tagCount} Tag(s)...
            </>
          ) : (
            <>
              <FaPrint className="me-2" />
              Print {tagCount} Tag(s)
            </>
          )}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default TagPrintingModal;
