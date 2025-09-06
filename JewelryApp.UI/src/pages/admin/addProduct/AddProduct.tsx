import { useEffect } from "react";
import { FaCloudUploadAlt, FaSave, FaTimes } from "react-icons/fa";
import { TbCirclePlusFilled } from "react-icons/tb";
import { generateSKU } from "../../../apis/products.api";
import { KaratType, ProductCategory } from "../../../types/enums";
import "./addProduct.scss";

const AddProduct = () => {
  const callAddProduct = () => {
    const data = generateSKU({
      karatType: KaratType.Karat18,
      category: ProductCategory.Bracelets,
    });

    console.log("data", data);
  };

  useEffect(() => {
    callAddProduct();
  }, []);
  return (
    <div id="add-product-page" className="page">
      <div className="page-header">
        <h1 className="page-title ">
          <TbCirclePlusFilled className="icon" />
          <span>Add New Product</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gray">
            <FaTimes className="icon" />
            Cancel
          </button>
          <button className="btn-md btn-gold">
            <FaSave className="icon" /> Save Product
          </button>
        </div>
      </div>

      <div className="card">
        <form id="product-form">
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter product name"
                  required
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">SKU</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Generate SKU"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Karat</label>
                <select className="form-control" required>
                  <option value="">Select Karat</option>
                  <option value="18K">18K Gold</option>
                  <option value="21K">21K Gold</option>
                  <option value="22K">22K Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Weight (grams)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="0.0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Category</label>
                <select className="form-control" required>
                  <option value="">Select Category</option>
                  <option value="rings">Rings</option>
                  <option value="necklaces">Necklaces</option>
                  <option value="earrings">Earrings</option>
                  <option value="bangles">Bangles</option>
                  <option value="bracelets">Bracelets</option>
                  <option value="pendants">Pendants</option>
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="0"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Size Details</label>
            <div className="form-row">
              <div className="form-col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ring size (if applicable)"
                />
              </div>
              <div className="form-col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Necklace length (if applicable)"
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> New Arrival
              </label>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> Featured
              </label>
              <label className="filter-option" style={{ margin: 0 }}>
                <input type="checkbox" /> Premium
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Product Image</label>
            <div
              style={{
                border: "1px dashed var(--border)",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
                background: "var(--light)",
              }}
            >
              <FaCloudUploadAlt
                style={{
                  fontSize: "24px",
                  color: "var(--secondary)",
                  marginBottom: "10px",
                }}
              />

              <p>
                Drag & drop images or{" "}
                <a href="#" style={{ color: "var(--gold)" }}>
                  browse
                </a>
              </p>
              <small className="text-muted">Recommended size: 500x500px</small>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
