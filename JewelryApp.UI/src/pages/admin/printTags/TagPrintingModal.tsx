import React, { useState, useEffect } from "react";
import { Modal, Form, Spinner } from "react-bootstrap";
import { FaPrint } from "react-icons/fa";
import "./tagPrintingModal.scss";
import type { Product } from "../inventory/Inventory";
import Barcode from "react-barcode";

interface TagPrintingModalProps {
  show: boolean;
  onClose: () => void;
  product: Product | null;
}

interface TagConfig {
  scale: number;
}

interface DymoPrinter {
  name: string;
  isConnected: boolean;
  printerType: string;
}

// Proxy configuration
const PROXY_URL = "http://localhost:8765/dymo";

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
  const [proxyStatus, setProxyStatus] = useState<{
    connected: boolean;
    message: string;
  }>({
    connected: false,
    message: "Checking...",
  });

  useEffect(() => {
    if (show) {
      checkProxyConnection();
    }
  }, [show]);

  if (!product) return null;

  // Check if proxy is running
  const checkProxyConnection = async () => {
    try {
      const response = await fetch(`${PROXY_URL.replace("/dymo", "")}/health`, {
        method: "GET",
      });

      if (response.ok) {
        setProxyStatus({
          connected: true,
          message: "Connected",
        });
        loadPrinters();
      } else {
        setProxyStatus({
          connected: false,
          message: "Proxy server not responding",
        });
      }
    } catch (error) {
      console.error("Proxy connection error:", error);
      setProxyStatus({
        connected: false,
        message: "Proxy server not running",
      });
    }
  };

  // Load printers through proxy
  const loadPrinters = async () => {
    setIsLoadingPrinters(true);

    try {
      const response = await fetch(
        `${PROXY_URL}/DYMO/DLS/Printing/GetPrinters`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get printers");
      }

      const xmlText = await response.text();

      // Parse XML response
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      const printerNodes = xmlDoc.getElementsByTagName("LabelWriterPrinter");

      const printersList: DymoPrinter[] = [];

      for (let i = 0; i < printerNodes.length; i++) {
        const node = printerNodes[i];
        const name = node.getElementsByTagName("Name")[0]?.textContent || "";
        const isConnected =
          node.getElementsByTagName("IsConnected")[0]?.textContent === "True";
        const printerType =
          node.getElementsByTagName("PrinterType")[0]?.textContent ||
          "LabelWriter";

        printersList.push({
          name,
          isConnected,
          printerType,
        });
      }

      const connectedPrinters = printersList.filter((p) => p.isConnected);
      setPrinters(connectedPrinters);

      if (connectedPrinters.length > 0) {
        setSelectedPrinter(connectedPrinters[0].name);
      }
    } catch (error) {
      console.error("Error loading printers:", error);
      alert("Failed to load printers. Make sure DYMO Connect is running.");
    } finally {
      setIsLoadingPrinters(false);
    }
  };

  const handleConfigChange = (key: keyof TagConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  // Test DYMO connection through proxy
  const testDymoConnection = async () => {
    try {
      // Test proxy
      const proxyHealth = await fetch(
        `${PROXY_URL.replace("/dymo", "")}/health`
      );
      if (!proxyHealth.ok) {
        alert(
          "❌ Proxy server not running.\n\nPlease start: node dymo-proxy-server.js"
        );
        return;
      }

      // Test DYMO
      const dymoStatus = await fetch(
        `${PROXY_URL}/DYMO/DLS/Printing/StatusConnected`
      );
      if (!dymoStatus.ok) {
        alert(
          "❌ DYMO Connect not accessible.\n\nMake sure DYMO Connect is running."
        );
        return;
      }

      // Get printers
      const printersResponse = await fetch(
        `${PROXY_URL}/DYMO/DLS/Printing/GetPrinters`
      );
      const printersXml = await printersResponse.text();

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(printersXml, "text/xml");
      const printerNodes = xmlDoc.getElementsByTagName("LabelWriterPrinter");

      let message = `✅ Proxy Server: Running\n`;
      message += `✅ DYMO Connect: Connected\n`;
      message += `✅ ${printerNodes.length} printer(s) detected:\n\n`;

      for (let i = 0; i < printerNodes.length; i++) {
        const node = printerNodes[i];
        const name =
          node.getElementsByTagName("Name")[0]?.textContent || "Unknown";
        const isConnected =
          node.getElementsByTagName("IsConnected")[0]?.textContent === "True";
        message += `${i + 1}. ${name}\n   Status: ${
          isConnected ? "Connected" : "Offline"
        }\n\n`;
      }

      alert(message);
    } catch (err) {
      console.error("DYMO Test Error:", err);
      alert(
        `❌ Connection failed: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    }
  };

  // Print tags through proxy
  const handlePrint = async () => {
    if (!selectedPrinter) {
      alert("❌ Please select a printer first.");
      return;
    }

    if (tagCount < 1 || tagCount > 300) {
      alert("❌ Please enter a valid number of tags (1-300).");
      return;
    }

    if (!proxyStatus.connected) {
      alert("❌ Proxy server not connected. Please start the proxy server.");
      return;
    }

    setIsPrinting(true);

    try {
      // Load label template
      let labelXml: string;
      try {
        const response = await fetch("/labels/jewelry.label");
        if (!response.ok) {
          throw new Error(`Failed to load label template: ${response.status}`);
        }
        labelXml = await response.text();
      } catch (fetchError) {
        console.error(
          "Failed to load label template, using default:",
          fetchError
        );
        labelXml = createDefaultLabelXml();
      }

      // Replace placeholders in label XML
      labelXml = labelXml
        .replace(/<Text>SKU<\/Text>/g, `<Text>${product.sku}</Text>`)
        .replace(/<Text>BARCODE<\/Text>/g, `<Text>${product.sku}</Text>`)
        .replace(
          /<Text>PRICE<\/Text>/g,
          `<Text>$${product.price.toFixed(2)}</Text>`
        )
        .replace(/<Text>WEIGHT<\/Text>/g, `<Text>${product.weight}g</Text>`)
        .replace(/<Text>KARAT<\/Text>/g, `<Text>${product.karatType}K</Text>`);

      // Create print params XML
      const printParamsXml = `<?xml version="1.0" encoding="utf-8"?>
<LabelWriterPrintParams>
  <Copies>${tagCount}</Copies>
  <JobTitle>Jewelry Tag - ${product.sku}</JobTitle>
  <PrintQuality>Text</PrintQuality>
  <FlowDirection>LeftToRight</FlowDirection>
</LabelWriterPrintParams>`;

      // Send print request through proxy
      const printResponse = await fetch(
        `${PROXY_URL}/DYMO/DLS/Printing/PrintLabel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            printerName: selectedPrinter,
            printParamsXml: printParamsXml,
            labelXml: labelXml,
          }).toString(),
        }
      );

      if (!printResponse.ok) {
        const errorText = await printResponse.text();
        throw new Error(`Print failed: ${errorText}`);
      }

      alert(`✅ Sent ${tagCount} tag(s) to ${selectedPrinter}.`);
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

  // Helper function for default label XML
  const createDefaultLabelXml = (): string => {
    return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
  <PaperOrientation>Landscape</PaperOrientation>
  <Id>JewelryTag</Id>
  <PaperName>30252 Address</PaperName>
  <DrawCommands>
    <RoundRectangle X="0" Y="0" Width="1440" Height="1440" Rx="270" Ry="270"/>
  </DrawCommands>
  <ObjectInfo>
    <TextObject>
      <Name>SKU</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <VerticalAlignment>Middle</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText/>
    </TextObject>
    <BarcodeObject>
      <Name>Barcode</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <Text>SKU12345</Text>
      <Type>Code128Auto</Type>
      <Size>Medium</Size>
      <TextPosition>Bottom</TextPosition>
      <TextFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
      <CheckSumFont Family="Arial" Size="8" Bold="False" Italic="False" Underline="False" Strikeout="False"/>
      <TextEmbedding>None</TextEmbedding>
      <ECLevel>0</ECLevel>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <QuietZonesPadding Left="0" Right="0" Top="0" Bottom="0"/>
    </BarcodeObject>
    <TextObject>
      <Name>Price</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <VerticalAlignment>Middle</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText/>
    </TextObject>
    <TextObject>
      <Name>Weight</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <VerticalAlignment>Middle</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText/>
    </TextObject>
    <TextObject>
      <Name>Karat</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <HorizontalAlignment>Center</HorizontalAlignment>
      <VerticalAlignment>Middle</VerticalAlignment>
      <TextFitMode>ShrinkToFit</TextFitMode>
      <UseFullFontHeight>True</UseFullFontHeight>
      <Verticalized>False</Verticalized>
      <StyledText/>
    </TextObject>
  </ObjectInfo>
</DieCutLabel>`;
  };

  const refreshPrinters = () => {
    checkProxyConnection();
  };

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
          <small className="ms-2 text-muted">(via Proxy)</small>
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
                {/* LEFT LOBE - BARCODE */}
                <div className="tag-lobe left-lobe">
                  <div className="barcode-box">
                    <Barcode
                      className="barCode"
                      value={product.sku}
                      width={1.5}
                      height={40}
                      margin={0}
                    />
                  </div>
                  <div className="sku">{product.sku}</div>
                </div>

                {/* CENTER BRIDGE */}
                <div className="tag-bridge"></div>

                {/* RIGHT LOBE - DETAILS */}
                <div className="tag-lobe right-lobe">
                  <div className="price">${product.price.toFixed(2)}</div>
                  <div className="weight">{product.weight}g</div>
                  <div className="karat">{product.karatType}K</div>
                </div>
              </div>
            </div>

            {/* PREVIEW SCALE CONTROL */}
            <div className="control-group mt-3">
              <label className="control-label">
                Preview Scale: {(config.scale * 100).toFixed(0)}%
              </label>
              <Form.Range
                min={0.5}
                max={1.5}
                step={0.1}
                value={config.scale}
                onChange={(e) =>
                  handleConfigChange("scale", parseFloat(e.target.value))
                }
              />
            </div>
          </div>

          {/* SETTINGS SECTION */}
          <div className="settings-section">
            <h6 className="section-title">Print Settings</h6>

            {/* PROXY STATUS */}
            <div className="proxy-status mb-3">
              <div className="status-item">
                <span className="status-label">Proxy Server:</span>
                <span
                  className={`status-value ${
                    proxyStatus.connected ? "text-success" : "text-danger"
                  }`}
                >
                  {proxyStatus.connected
                    ? "✓ Connected"
                    : "✗ " + proxyStatus.message}
                </span>
              </div>
            </div>

            {!proxyStatus.connected && (
              <div className="alert alert-warning p-2 mb-3">
                <small>
                  <strong>Proxy server not running!</strong>
                </small>
                <ul className="mb-0 mt-1 ps-3">
                  <li>
                    <small>
                      Start proxy: <code>npm start</code>
                    </small>
                  </li>
                  <li>
                    <small>Keep it running while printing</small>
                  </li>
                </ul>
              </div>
            )}

            {/* PRINTER SELECTION */}
            <div className="control-group">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <label className="control-label">Printer Selection</label>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={refreshPrinters}
                  disabled={isLoadingPrinters || !proxyStatus.connected}
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
                    <option key={printer.name} value={printer.name}>
                      {printer.name} ({printer.printerType})
                    </option>
                  ))}
                </Form.Select>
              ) : (
                <div className="alert alert-warning p-2 mb-0">
                  <small>No connected DYMO printers found.</small>
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
                  Price: <strong>${product.price.toFixed(2)}</strong>
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
                Test Connection
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
          disabled={!selectedPrinter || !proxyStatus.connected || isPrinting}
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
