import CustomTable, { type TableHeader } from "../../../components/tables/Table/CustomTable";
import "./tagPrinting.scss";
import { FaPrint, FaSearch, FaRedo, FaGem, FaHeart } from "react-icons/fa";

const TagPrinting = () => {
  const productsHeaders: TableHeader[] = [
    { key: "select", label: "Select", width: "60px" },
    { key: "product", label: "Product", width: "250px" },
    { key: "sku", label: "SKU", width: "120px" },
    { key: "karat", label: "Karat", width: "80px" },
    { key: "weight", label: "Weight", width: "100px" },
    { key: "price", label: "Price", width: "120px" },
  ];

  const productsData = [
    {
      Select: <input type="checkbox" />,
      Product: "Diamond Engagement Ring",
      SKU: "GL-RNG-001",
      Karat: "18K",
      Weight: "4.2g",
      Price: "$1,920",
    },
    {
      Select: <input type="checkbox" defaultChecked />,
      Product: "Sapphire Pendant",
      SKU: "GL-PND-042",
      Karat: "21K",
      Weight: "7.8g",
      Price: "$2,480",
    },
    {
      Select: <input type="checkbox" />,
      Product: "Gold Bangle Set",
      SKU: "GL-BGL-205",
      Karat: "22K",
      Weight: "24.5g",
      Price: "$5,980",
    },
    {
      Select: <input type="checkbox" defaultChecked />,
      Product: "Emerald Earrings",
      SKU: "GL-ERN-112",
      Karat: "18K",
      Weight: "3.5g",
      Price: "$1,250",
    },
  ];

  return (
    <div id="tag-printing" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaPrint className="icon" /> <span>Tag Printing</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold">
            <FaPrint /> Print Tags
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Select Products</h3>
          <div>
            <div className="search-bar" style={{ width: "250px" }}>
              <FaSearch className="icon" />
              <input type="text" placeholder="Search products..." />
            </div>
          </div>
        </div>

        <CustomTable headers={productsHeaders} data={productsData} />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Tag Preview</h3>
          <div>
            <button className="btn-md btn-gray">
              <FaRedo /> Refresh Preview
            </button>
          </div>
        </div>

        <div className="tag-preview-grid">
          <div className="tag-preview">
            <div className="product-img">
              <FaGem />
            </div>
            <h4>Sapphire Pendant</h4>
            <p>SKU: GL-PND-042</p>
            <p>21K Gold - 7.8g</p>
            <p style={{ fontWeight: "bold", color: "var(--gold)" }}>$2,480</p>
          </div>

          <div className="tag-preview">
            <div className="product-img">
              <FaHeart />
            </div>
            <h4>Emerald Earrings</h4>
            <p>SKU: GL-ERN-112</p>
            <p>18K Gold - 3.5g</p>
            <p style={{ fontWeight: "bold", color: "var(--gold)" }}>$1,250</p>
          </div>
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
      </div>
    </div>
  );
};

export default TagPrinting;
