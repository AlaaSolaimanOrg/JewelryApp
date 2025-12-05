import React, { useState, useEffect } from "react";
import CustomTable, { type TableHeader } from "../../../components/tables/Table/CustomTable";
import "./tagPrinting.scss";
import { FaPrint, FaSearch, FaRedo, FaGem, FaHeart, FaCog } from "react-icons/fa";
import TagPrintingModal from "../../../components/modals/TagPrintingModal/TagPrintingModal";
import type { Product } from "./Inventory";

// Proxy configuration
const PROXY_URL = 'http://localhost:8765/dymo';
const USE_PROXY = true;

interface DymoStatus {
  proxyRunning: boolean;
  dymoConnected: boolean;
  printersFound: number;
}

const TagPrinting = () => {
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set(["GL-PND-042", "GL-ERN-112"]));
  const [searchQuery, setSearchQuery] = useState("");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dymoStatus, setDymoStatus] = useState<DymoStatus>({
    proxyRunning: false,
    dymoConnected: false,
    printersFound: 0,
  });
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  // Mock products data - replace with actual data from your API
  const allProducts: Product[] = [
    {
      id: "1",
      sku: "GL-RNG-001",
      name: "Diamond Engagement Ring",
      karatType: 18,
      weight: 4.2,
      price: 1920,
      category: "Rings",
      status: "active",
    },
    {
      id: "2",
      sku: "GL-PND-042",
      name: "Sapphire Pendant",
      karatType: 21,
      weight: 7.8,
      price: 2480,
      category: "Pendants",
      status: "active",
    },
    {
      id: "3",
      sku: "GL-BGL-205",
      name: "Gold Bangle Set",
      karatType: 22,
      weight: 24.5,
      price: 5980,
      category: "Bangles",
      status: "active",
    },
    {
      id: "4",
      sku: "GL-ERN-112",
      name: "Emerald Earrings",
      karatType: 18,
      weight: 3.5,
      price: 1250,
      category: "Earrings",
      status: "active",
    },
  ];

  const productsHeaders: TableHeader[] = [
    { key: "select", label: "Select", width: "60px" },
    { key: "product", label: "Product", width: "250px" },
    { key: "sku", label: "SKU", width: "120px" },
    { key: "karat", label: "Karat", width: "80px" },
    { key: "weight", label: "Weight", width: "100px" },
    { key: "price", label: "Price", width: "120px" },
    { key: "actions", label: "Actions", width: "100px" },
  ];

  // Filter products by search query
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Convert to table data format
  const productsData = filteredProducts.map(product => ({
    Select: (
      <input
        type="checkbox"
        checked={selectedProducts.has(product.sku)}
        onChange={() => handleToggleProduct(product.sku)}
      />
    ),
    Product: product.name,
    SKU: product.sku,
    Karat: `${product.karatType}K`,
    Weight: `${product.weight}g`,
    Price: `$${product.price.toLocaleString()}`,
    Actions: (
      <button
        className="btn-sm btn-primary"
        onClick={() => handlePrintSingle(product)}
        title="Print tags for this product"
      >
        <FaPrint />
      </button>
    ),
  }));

  // Check DYMO proxy status on mount
  useEffect(() => {
    checkDymoStatus();
  }, []);

  const handleToggleProduct = (sku: string) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sku)) {
        newSet.delete(sku);
      } else {
        newSet.add(sku);
      }
      return newSet;
    });
  };

  const handlePrintSingle = (product: Product) => {
    setSelectedProduct(product);
    setShowPrintModal(true);
  };

  const handlePrintSelected = () => {
    if (selectedProducts.size === 0) {
      alert("❌ Please select at least one product to print.");
      return;
    }

    // For bulk printing, open modal with first selected product
    const firstSku = Array.from(selectedProducts)[0];
    const product = allProducts.find(p => p.sku === firstSku);
    if (product) {
      setSelectedProduct(product);
      setShowPrintModal(true);
    }
  };

  const checkDymoStatus = async () => {
    setIsCheckingStatus(true);
    
    try {
      // Check if proxy is running
      const proxyResponse = await fetch(`${PROXY_URL.replace('/dymo', '')}/health`, {
        method: 'GET',
      });
      
      const proxyRunning = proxyResponse.ok;
      
      if (!proxyRunning) {
        setDymoStatus({
          proxyRunning: false,
          dymoConnected: false,
          printersFound: 0,
        });
        return;
      }

      // Check DYMO connection through proxy
      const dymoResponse = await fetch(`${PROXY_URL}/DYMO/DLS/Printing/StatusConnected`);
      const dymoConnected = dymoResponse.ok;

      // Get printers count
      let printersFound = 0;
      if (dymoConnected) {
        try {
          const printersResponse = await fetch(`${PROXY_URL}/DYMO/DLS/Printing/GetPrinters`);
          const printersXml = await printersResponse.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(printersXml, 'text/xml');
          const printerNodes = xmlDoc.getElementsByTagName('LabelWriterPrinter');
          printersFound = printerNodes.length;
        } catch (e) {
          console.error("Error counting printers:", e);
        }
      }

      setDymoStatus({
        proxyRunning,
        dymoConnected,
        printersFound,
      });

    } catch (error) {
      console.error("Error checking DYMO status:", error);
      setDymoStatus({
        proxyRunning: false,
        dymoConnected: false,
        printersFound: 0,
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const getSelectedProductsData = () => {
    return allProducts.filter(p => selectedProducts.has(p.sku));
  };

  const renderStatusBadge = () => {
    if (isCheckingStatus) {
      return (
        <div className="status-badge status-checking">
          <span className="status-dot"></span>
          Checking...
        </div>
      );
    }

    if (!dymoStatus.proxyRunning) {
      return (
        <div className="status-badge status-error" title="Proxy server not running">
          <span className="status-dot"></span>
          Proxy Offline
        </div>
      );
    }

    if (!dymoStatus.dymoConnected) {
      return (
        <div className="status-badge status-warning" title="DYMO Connect not accessible">
          <span className="status-dot"></span>
          DYMO Offline
        </div>
      );
    }

    if (dymoStatus.printersFound === 0) {
      return (
        <div className="status-badge status-warning" title="No printers detected">
          <span className="status-dot"></span>
          No Printers
        </div>
      );
    }

    return (
      <div className="status-badge status-success" title={`${dymoStatus.printersFound} printer(s) ready`}>
        <span className="status-dot"></span>
        Ready ({dymoStatus.printersFound})
      </div>
    );
  };

  return (
    <div id="tag-printing" className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <FaPrint className="icon" /> <span>Tag Printing</span>
          </h1>
          <div className="status-container">
            {renderStatusBadge()}
            <button
              className="btn-sm btn-outline-secondary"
              onClick={checkDymoStatus}
              disabled={isCheckingStatus}
              title="Refresh connection status"
            >
              <FaRedo />
            </button>
          </div>
        </div>
        <div className="page-actions">
          <button 
            className="btn-md btn-gold"
            onClick={handlePrintSelected}
            disabled={selectedProducts.size === 0}
          >
            <FaPrint /> Print Selected ({selectedProducts.size})
          </button>
        </div>
      </div>

      {/* Setup Instructions Card */}
      {!dymoStatus.proxyRunning && (
        <div className="card card-warning">
          <div className="card-header">
            <h3 className="card-title">⚠️ Proxy Server Required</h3>
          </div>
          <div className="card-body">
            <p><strong>To print labels from this website, you need to run the DYMO Proxy Server on your computer.</strong></p>
            <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Download the proxy server files from IT support</li>
              <li>Install Node.js if not already installed</li>
              <li>Run: <code>npm install</code> in the proxy folder</li>
              <li>Run: <code>npm start</code> to start the proxy</li>
              <li>Keep the proxy running while using this page</li>
              <li>Click the refresh button above to reconnect</li>
            </ol>
            <p style={{ marginTop: "15px", fontSize: "14px", color: "#666" }}>
              <strong>Note:</strong> Make sure DYMO Connect is also installed and running.
            </p>
          </div>
        </div>
      )}

      {!dymoStatus.dymoConnected && dymoStatus.proxyRunning && (
        <div className="card card-warning">
          <div className="card-header">
            <h3 className="card-title">⚠️ DYMO Connect Not Detected</h3>
          </div>
          <div className="card-body">
            <p><strong>The proxy server is running, but DYMO Connect is not accessible.</strong></p>
            <ol style={{ marginLeft: "20px", marginTop: "10px" }}>
              <li>Make sure DYMO Connect is installed</li>
              <li>Check if DYMO Connect is running (system tray icon)</li>
              <li>Restart DYMO Connect if needed</li>
              <li>Click the refresh button to reconnect</li>
            </ol>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Select Products</h3>
          <div>
            <div className="search-bar" style={{ width: "250px" }}>
              <FaSearch className="icon" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <CustomTable headers={productsHeaders} data={productsData} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Selected Products Preview</h3>
          <div>
            <button className="btn-md btn-gray" onClick={checkDymoStatus}>
              <FaRedo /> Refresh Status
            </button>
          </div>
        </div>

        {selectedProducts.size === 0 ? (
          <div className="card-body" style={{ textAlign: "center", padding: "40px" }}>
            <FaGem style={{ fontSize: "48px", color: "#ccc", marginBottom: "15px" }} />
            <p style={{ color: "#666" }}>No products selected. Select products from the table above.</p>
          </div>
        ) : (
          <>
            <div className="tag-preview-grid">
              {getSelectedProductsData().map(product => (
                <div key={product.sku} className="tag-preview">
                  <div className="product-img">
                    {product.category === "Pendants" ? <FaHeart /> : <FaGem />}
                  </div>
                  <h4>{product.name}</h4>
                  <p>SKU: {product.sku}</p>
                  <p>{product.karatType}K Gold - {product.weight}g</p>
                  <p style={{ fontWeight: "bold", color: "var(--gold)" }}>
                    ${product.price.toLocaleString()}
                  </p>
                  <button
                    className="btn-sm btn-outline-primary"
                    onClick={() => handlePrintSingle(product)}
                    style={{ marginTop: "8px" }}
                  >
                    <FaPrint /> Print
                  </button>
                </div>
              ))}
            </div>

            <div className="form-row" style={{ marginTop: "25px" }}>
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Tag Size</label>
                  <select className="form-control">
                    <option>Standard (2" x 3")</option>
                    <option>Large (3" x 4")</option>
                    <option>Small (1.5" x 2")</option>
                  </select>
                </div>
              </div>

              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Fields to Include</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                    <label className="filter-option" style={{ margin: 0 }}>
                      <input type="checkbox" defaultChecked /> SKU
                    </label>
                    <label className="filter-option" style={{ margin: 0 }}>
                      <input type="checkbox" defaultChecked /> Weight
                    </label>
                    <label className="filter-option" style={{ margin: 0 }}>
                      <input type="checkbox" defaultChecked /> Karat
                    </label>
                    <label className="filter-option" style={{ margin: 0 }}>
                      <input type="checkbox" defaultChecked /> Price
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Print Modal */}
      {showPrintModal && selectedProduct && (
        <TagPrintingModal
          show={showPrintModal}
          onClose={() => {
            setShowPrintModal(false);
            setSelectedProduct(null);
          }}
          product={selectedProduct}
        />
      )}
    </div>
  );
};

export default TagPrinting;