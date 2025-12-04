import React, { useState, useEffect } from "react";
import { Modal, Form, Spinner, Alert } from "react-bootstrap";
import { FaPrint, FaSync, FaPlug, FaBug } from "react-icons/fa";
import "./tagPrintingModal.scss";
import type { Product } from "../../../pages/admin/inventory/Inventory";
import Barcode from "react-barcode";

interface TagPrintingModalProps {
  show: boolean;
  onClose: () => void;
  product: Product | null;
}

interface DymoPrinter {
  name: string;
  isConnected: boolean;
  isLocal: boolean;
  printerType: string;
}

interface DymoStatus {
  isInstalled: boolean;
  isSupported: boolean;
  isInitialized: boolean;
  version: string;
}

interface TagConfig {
  scale: number;
}

// DYMO types
interface DymoLabel {
  setObjectText: (objectName: string, text: string) => void;
  isValidLabel: () => boolean;
  isDCDLabel: () => boolean;
  isDLSLabel: () => boolean;
  print: (printerName: string, printParamsXml?: string, labelSetXml?: string) => void;
  printAndPollStatus: (printerName: string, printParamsXml?: string, labelSetXml?: string) => Promise<any>;
  getPrinters: () => string[];
}

interface DymoFramework {
  checkEnvironment: () => { isFrameworkInstalled: boolean; isBrowserSupported: boolean };
  init: () => Promise<void>;
  openLabelXml: (xml: string) => DymoLabel;
  openLabelFile: (fileName: string) => DymoLabel;
  getPrinters: () => DymoPrinter[];
  printLabel: (printerName: string, printParamsXml: string, labelXml: string, labelSetXml?: string) => void;
  createLabelWriterPrintParamsXml: (params: {
    printerName?: string;
    numCopies?: number;
    labelSetXml?: string;
    printQuality?: string;
    twinTurboRoll?: string;
    flowDirection?: string;
  }) => string;
  VERSION: string;
}

interface DymoWindow extends Window {
  dymo?: {
    label: {
      framework: DymoFramework;
    };
  };
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
  const [dymoStatus, setDymoStatus] = useState<DymoStatus>({
    isInstalled: false,
    isSupported: false,
    isInitialized: false,
    version: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (show && product) {
      setErrorMessage("");
      initializeDymo();
    }
  }, [show, product]);

  const initializeDymo = async () => {
    const dymoWindow = window as DymoWindow;
    
    // First, try to load the DYMO script if not present
    if (!dymoWindow.dymo) {
      await loadDymoScript();
    }
    
    if (!dymoWindow.dymo) {
      setErrorMessage("DYMO Label Framework not found. Please ensure DYMO Connect is running.");
      return;
    }
    
    checkDymoEnvironment();
    loadPrinters();
  };

  const loadDymoScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      const dymoWindow = window as DymoWindow;
      
      // If already loaded
      if (dymoWindow.dymo) {
        resolve(true);
        return;
      }
      
      // Try different endpoints
      const endpoints = [
        '/DYMO/DLS/JavaScript/dymo.connect.framework.js',
        'http://localhost:41951/DYMO/DLS/JavaScript/dymo.connect.framework.js',
        'http://127.0.0.1:41951/DYMO/DLS/JavaScript/dymo.connect.framework.js'
      ];
      
      let currentEndpointIndex = 0;
      
      const tryLoadScript = () => {
        if (currentEndpointIndex >= endpoints.length) {
          console.error("All DYMO endpoints failed");
          resolve(false);
          return;
        }
        
        const endpoint = endpoints[currentEndpointIndex];
        const script = document.createElement('script');
        script.src = endpoint;
        
        script.onload = () => {
          console.log(`DYMO script loaded from ${endpoint}`);
          // Wait a moment for the DYMO object to initialize
          setTimeout(() => {
            if (dymoWindow.dymo) {
              resolve(true);
            } else {
              currentEndpointIndex++;
              tryLoadScript();
            }
          }, 500);
        };
        
        script.onerror = () => {
          console.warn(`Failed to load DYMO script from ${endpoint}`);
          currentEndpointIndex++;
          tryLoadScript();
        };
        
        document.head.appendChild(script);
      };
      
      tryLoadScript();
    });
  };

  const checkDymoEnvironment = () => {
    const dymoWindow = window as DymoWindow;
    
    if (!dymoWindow.dymo) {
      setDymoStatus({
        isInstalled: false,
        isSupported: false,
        isInitialized: false,
        version: "",
      });
      return;
    }

    try {
      const env = dymoWindow.dymo.label.framework.checkEnvironment();
      setDymoStatus({
        isInstalled: env.isFrameworkInstalled,
        isSupported: env.isBrowserSupported,
        isInitialized: false,
        version: dymoWindow.dymo.label.framework.VERSION || "Unknown",
      });
    } catch (error) {
      console.error("Error checking DYMO environment:", error);
      setDymoStatus({
        isInstalled: false,
        isSupported: false,
        isInitialized: false,
        version: "",
      });
      setErrorMessage("Failed to check DYMO environment. Make sure DYMO Connect is properly installed.");
    }
  };

  const loadPrinters = async () => {
    const dymoWindow = window as DymoWindow;
    
    if (!dymoWindow.dymo) {
      setErrorMessage("DYMO framework not available");
      return;
    }

    setIsLoadingPrinters(true);
    setErrorMessage("");
    
    try {
      // Initialize framework if not already
      if (!dymoStatus.isInitialized) {
        await dymoWindow.dymo.label.framework.init();
        setDymoStatus(prev => ({ 
          ...prev, 
          isInitialized: true 
        }));
      }

      // Get all printers
      const allPrinters = dymoWindow.dymo.label.framework.getPrinters();
      console.log("Found printers:", allPrinters);
      
      // Filter for connected printers
      const connectedPrinters = allPrinters.filter(p => p.isConnected);
      setPrinters(connectedPrinters);
      
      // Auto-select first connected printer
      if (connectedPrinters.length > 0) {
        setSelectedPrinter(connectedPrinters[0].name);
      } else if (allPrinters.length > 0) {
        setErrorMessage("Printers found but none are connected. Please check printer connection.");
      } else {
        setErrorMessage("No DYMO printers detected. Make sure a printer is connected and turned on.");
      }
    } catch (error) {
      console.error("Error loading printers:", error);
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(`Failed to load printers: ${errorMsg}. Make sure DYMO Connect is running.`);
    } finally {
      setIsLoadingPrinters(false);
    }
  };

  const handleConfigChange = (key: keyof TagConfig, value: number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const testDymoConnection = async () => {
    const dymoWindow = window as DymoWindow;
    setErrorMessage("");
    
    if (!dymoWindow.dymo) {
      const loaded = await loadDymoScript();
      if (!loaded) {
        setErrorMessage("❌ DYMO Label Framework not detected.\nPlease make sure:\n1. DYMO Connect is installed\n2. DYMO Connect is running\n3. The DYMO SDK script is accessible");
        return;
      }
    }

    try {
      await dymoWindow.dymo!.label.framework.init();
      const printers = dymoWindow.dymo!.label.framework.getPrinters();
      
      if (!printers || printers.length === 0) {
        setErrorMessage("❌ No DYMO printers detected.\nMake sure:\n1. Printer is connected via USB\n2. DYMO Connect is running\n3. Printer is turned on");
        return;
      }

      const connectedPrinters = printers.filter(p => p.isConnected);
      
      if (connectedPrinters.length === 0) {
        setErrorMessage("❌ No connected DYMO printers found.");
        return;
      }

      let message = `✅ DYMO ${dymoWindow.dymo!.label.framework.VERSION}\n`;
      message += `✅ ${connectedPrinters.length} printer(s) detected:\n\n`;
      connectedPrinters.forEach((printer, index) => {
        message += `${index + 1}. ${printer.name}\n   Type: ${printer.printerType}\n   Status: Connected\n\n`;
      });
      
      alert(message);
    } catch (err) {
      console.error("DYMO Test Error:", err);
      setErrorMessage("❌ Could not access DYMO SDK. Make sure DYMO Connect is running.");
    }
  };

  const handlePrint = async () => {
    if (!selectedPrinter) {
      setErrorMessage("❌ Please select a printer first.");
      return;
    }

    if (tagCount < 1 || tagCount > 300) {
      setErrorMessage("❌ Please enter a valid number of tags (1-300).");
      return;
    }

    if (!product) {
      setErrorMessage("❌ No product selected.");
      return;
    }

    const dymoWindow = window as DymoWindow;
    
    if (!dymoWindow.dymo) {
      setErrorMessage("DYMO Label Framework not detected. Please install DYMO Connect.");
      return;
    }

    setIsPrinting(true);
    setErrorMessage("");

    try {
      // Initialize framework
      if (!dymoStatus.isInitialized) {
        await dymoWindow.dymo.label.framework.init();
      }

      // Create label XML
      const labelXml = createLabelXml({
        SKU: product.sku,
        PRICE: `$${product.price.toFixed(2)}`,
        WEIGHT: `${product.weight}g`,
        KARAT: `${product.karatType}K`,
        BARCODE: product.sku
      });

      // Open label
      const label = dymoWindow.dymo.label.framework.openLabelXml(labelXml);
      
      // Validate label
      if (!label.isValidLabel()) {
        throw new Error("Invalid label format");
      }

      // Verify printer is still available
      const currentPrinters = dymoWindow.dymo.label.framework.getPrinters();
      const printer = currentPrinters.find(p => p.name === selectedPrinter && p.isConnected);
      
      if (!printer) {
        throw new Error("Selected printer is no longer available");
      }

      // Print the label with multiple copies
      console.log(`Printing ${tagCount} copies to ${printer.name}`);
      
      if (tagCount === 1) {
        // Single copy
        label.print(printer.name);
      } else {
        // Multiple copies - create label set
        let labelSetXml = '<?xml version="1.0" encoding="utf-8"?>';
        labelSetXml += '<LabelSet>';
        for (let i = 0; i < tagCount; i++) {
          labelSetXml += `<Label><ObjectData></ObjectData></Label>`;
        }
        labelSetXml += '</LabelSet>';
        
        // Use printAndPollStatus for better error handling
        await label.printAndPollStatus(printer.name, '', labelSetXml);
      }

      alert(`✅ Sent ${tagCount} tag(s) to ${printer.name}.`);
      
    } catch (err) {
      console.error("PRINT ERROR:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setErrorMessage(`❌ Printing failed: ${errorMessage}`);
    } finally {
      setIsPrinting(false);
    }
  };

  const createLabelXml = (fields: Record<string, string>): string => {
    return `<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
  <PaperOrientation>Portrait</PaperOrientation>
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
      <StyledText>
        <Element>
          <String>${fields.SKU}</String>
          <Attributes>
            <Font Family="Arial" Size="12" Bold="True"/>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
    <BarcodeObject>
      <Name>BARCODE</Name>
      <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
      <BackColor Alpha="0" Red="255" Green="255" Blue="255"/>
      <LinkedObjectName></LinkedObjectName>
      <Rotation>Rotation0</Rotation>
      <IsMirrored>False</IsMirrored>
      <IsVariable>True</IsVariable>
      <Text>${fields.BARCODE}</Text>
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
      <Name>PRICE</Name>
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
      <StyledText>
        <Element>
          <String>${fields.PRICE}</String>
          <Attributes>
            <Font Family="Arial" Size="14" Bold="True"/>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
    <TextObject>
      <Name>WEIGHT</Name>
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
      <StyledText>
        <Element>
          <String>${fields.WEIGHT}</String>
          <Attributes>
            <Font Family="Arial" Size="10" Bold="True"/>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
    <TextObject>
      <Name>KARAT</Name>
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
      <StyledText>
        <Element>
          <String>${fields.KARAT}</String>
          <Attributes>
            <Font Family="Arial" Size="10" Bold="True"/>
            <ForeColor Alpha="255" Red="0" Green="0" Blue="0"/>
          </Attributes>
        </Element>
      </StyledText>
    </TextObject>
  </ObjectInfo>
</DieCutLabel>`;
  };

  const refreshPrinters = () => {
    loadPrinters();
  };

  const debugDymoObject = () => {
    const dymoWindow = window as DymoWindow;
    console.log("Full DYMO object:", dymoWindow.dymo);
    if (dymoWindow.dymo) {
      console.log("Framework version:", dymoWindow.dymo.label.framework.VERSION);
      console.log("Available methods:", Object.keys(dymoWindow.dymo.label.framework));
    }
    alert("Check browser console for DYMO debug information");
  };

  if (!product) return null;

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
            <small className="ms-2 text-muted">(DYMO {dymoStatus.version})</small>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="tag-modal-body">
        {errorMessage && (
          <Alert 
            variant="danger" 
            className="mb-3"
            onClose={() => setErrorMessage("")}
            dismissible
          >
            <div style={{ whiteSpace: 'pre-line' }}>{errorMessage}</div>
          </Alert>
        )}

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

            {/* DYMO STATUS */}
            <div className="dymo-status mb-3">
              <div className="status-item">
                <span className="status-label">DYMO Connect:</span>
                <span className={`status-value ${dymoStatus.isInstalled ? "text-success" : "text-danger"}`}>
                  {dymoStatus.isInstalled ? "✓ Installed" : "✗ Not Installed"}
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
                <span className={`status-value ${dymoStatus.isInitialized ? "text-success" : "text-warning"}`}>
                  {dymoStatus.isInitialized ? "✓ Ready" : "⚠ Not Ready"}
                </span>
              </div>
              <div className="status-item">
                <span className="status-label">Browser Support:</span>
                <span className={`status-value ${dymoStatus.isSupported ? "text-success" : "text-danger"}`}>
                  {dymoStatus.isSupported ? "✓ Supported" : "✗ Not Supported"}
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
                  disabled={isLoadingPrinters || isPrinting}
                >
                  {isLoadingPrinters ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-1" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <FaSync className="me-1" />
                      Refresh
                    </>
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
                  disabled={isPrinting}
                >
                  <option value="">Select a printer...</option>
                  {printers.map(printer => (
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
                    <li><small>DYMO Connect is running</small></li>
                    <li><small>Printer is connected via USB</small></li>
                    <li><small>Printer is turned on</small></li>
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
                disabled={isPrinting}
              />
              <div className="form-text">
                Enter a number between 1 and 300
              </div>
            </div>

            {/* PRODUCT INFO */}
            <div className="info-text">
              <div className="d-flex justify-content-between">
                <small>SKU: <strong>{product.sku}</strong></small>
                <small>Price: <strong>${product.price.toFixed(2)}</strong></small>
              </div>
              <div className="d-flex justify-content-between mt-1">
                <small>Weight: <strong>{product.weight}g</strong></small>
                <small>Karat: <strong>{product.karatType}K</strong></small>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="d-grid gap-2 mt-3">
              <button 
                className="btn btn-outline-info" 
                onClick={testDymoConnection}
                disabled={isPrinting}
              >
                <FaPlug className="me-2" />
                Test DYMO Connection
              </button>
              <button 
                className="btn btn-outline-secondary btn-sm" 
                onClick={debugDymoObject}
                disabled={isPrinting}
              >
                <FaBug className="me-2" />
                Debug DYMO Object
              </button>
            </div>

            {/* TROUBLESHOOTING TIPS */}
            <div className="alert alert-info mt-3 p-2">
              <small><strong>Not working?</strong> Try these steps:</small>
              <ol className="mb-0 mt-1 ps-3">
                <li><small>Ensure DYMO Connect is running</small></li>
                <li><small>Check printer USB connection</small></li>
                <li><small>Restart DYMO Connect if needed</small></li>
                <li><small>Refresh the printer list</small></li>
              </ol>
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
          disabled={!selectedPrinter || !dymoStatus.isInstalled || isPrinting}
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