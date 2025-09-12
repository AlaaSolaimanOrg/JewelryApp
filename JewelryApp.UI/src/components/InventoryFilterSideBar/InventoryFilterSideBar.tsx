import { FaFilter, FaRedo } from "react-icons/fa";
import "./inventoryFilterSideBar.scss";

const InventoryFilterSideBar = () => {
  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">
        <FaFilter className="me-2" /> Filter Inventory
      </h3>

      {/* Karat */}
      <div className="filter-group">
        <span className="filter-group-title">Karat</span>
        <div className="filter-option">
          <input type="checkbox" id="karat-18" defaultChecked />
          <label htmlFor="karat-18">18K Gold</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="karat-21" defaultChecked />
          <label htmlFor="karat-21">21K Gold</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="karat-22" />
          <label htmlFor="karat-22">22K Gold</label>
        </div>
      </div>

      {/* Weight */}
      <div className="filter-group">
        <span className="filter-group-title">Weight (grams)</span>
        <div className="range-slider">
          <input
            type="range"
            min="0"
            max="50"
            defaultValue="15"
            className="slider"
            id="weight-range"
          />
        </div>
        <div className="slider-values">
          <span>0g</span>
          <span id="weight-value">15g</span>
          <span>50g</span>
        </div>
      </div>

      {/* Category */}
      <div className="filter-group">
        <span className="filter-group-title">Category</span>
        <select className="form-control">
          <option>All Categories</option>
          <option>Rings</option>
          <option>Necklaces</option>
          <option>Earrings</option>
          <option>Bangles</option>
          <option>Bracelets</option>
          <option>Pendants</option>
        </select>
      </div>

      {/* Size */}
      <div className="filter-group">
        <span className="filter-group-title">Size</span>
        <div className="form-row">
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Ring Size</label>
              <select className="form-control">
                <option>Any</option>
                <option>4-6</option>
                <option>7-9</option>
                <option>10+</option>
              </select>
            </div>
          </div>
          <div className="form-col">
            <div className="form-group">
              <label className="form-label">Necklace Length</label>
              <select className="form-control">
                <option>Any</option>
                <option>16-18"</option>
                <option>19-21"</option>
                <option>22+"</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="filter-group">
        <span className="filter-group-title">Tags</span>
        <div className="filter-option">
          <input type="checkbox" id="tag-new" />
          <label htmlFor="tag-new">New Arrivals</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="tag-featured" />
          <label htmlFor="tag-featured">Featured</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="tag-premium" />
          <label htmlFor="tag-premium">Premium Collection</label>
        </div>
        <div className="filter-option">
          <input type="checkbox" id="tag-low-stock" />
          <label htmlFor="tag-low-stock">Low Stock</label>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="form-group" style={{ marginTop: "20px" }}>
        <button className="btn-md btn-gold" style={{ width: "100%" }}>
          <FaFilter className="me-1" /> Apply Filters
        </button>
        <button
          className="btn-md btn-gray"
          style={{ width: "100%", marginTop: "10px" }}
        >
          <FaRedo className="me-1" /> Reset Filters
        </button>
      </div>
    </div>
  );
};

export default InventoryFilterSideBar;
