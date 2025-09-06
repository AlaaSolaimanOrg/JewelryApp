import {
  FaArrowDown,
  FaArrowUp,
  FaBox,
  FaDollarSign,
  FaEdit,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaFileExport,
  FaFilter,
  FaGem,
  FaHeart,
  FaHistory,
  FaInfinity,
  FaPlus,
  FaRedo,
  FaRing,
  FaSearch,
  FaStar,
  FaTag,
  FaTags,
  FaTrash,
} from "react-icons/fa";
import "./inventory.scss";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  return (
    <div id="inventory" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaBox className="icon me-2" />
          <span>Inventory Management</span>
        </h1>
        <div className="page-actions">
          <button
            className="btn-md btn-gold"
            onClick={() => {
              navigate("/admin/addProduct");
            }}
          >
            <FaPlus className="me-1" /> Add Product
          </button>
          <button className="btn-md btn-gray">
            <FaExchangeAlt className="me-1" /> Stock In/Out
          </button>
          <button className="btn-md btn-gray">
            <FaTags className="me-1" /> Print Tags
          </button>
          <button className="btn-md btn-gray">
            <FaFileExport className="me-1" /> Export
          </button>
        </div>
      </div>

      <div className="inventory-grid">
        {/* Sidebar */}
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
            <div className="filter-option">
              <input type="checkbox" id="platinum" />
              <label htmlFor="platinum">Platinum</label>
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

        {/* Inventory Content */}
        <div className="inventory-content">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Inventory Items (124)</h3>
              <div>
                <div className="search-bar" style={{ width: "250px" }}>
                  <FaSearch className="icon me-1" />
                  <input type="text" placeholder="Search inventory..." />
                </div>
              </div>
            </div>

            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product Name</th>
                    <th>SKU</th>
                    <th>Karat</th>
                    <th>Weight</th>
                    <th>Quantity</th>
                    <th>Category</th>
                    <th>Tags</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="product-img">
                        <FaRing />
                      </div>
                    </td>
                    <td>Diamond Engagement Ring</td>
                    <td>GL-RNG-001</td>
                    <td>18K</td>
                    <td>4.2g</td>
                    <td>12</td>
                    <td>Rings</td>
                    <td>
                      <span className="tag tag-new">New</span>
                      <span className="tag tag-premium">Premium</span>
                    </td>
                    <td>
                      <button className="action-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn" title="History">
                        <FaHistory />
                      </button>
                      <button className="action-btn" title="Print Tag">
                        <FaTag />
                      </button>
                      <button className="action-btn danger" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-img">
                        <FaGem />
                      </div>
                    </td>
                    <td>Sapphire Pendant</td>
                    <td>GL-PND-042</td>
                    <td>21K</td>
                    <td>7.8g</td>
                    <td>8</td>
                    <td>Necklaces</td>
                    <td>
                      <span className="tag tag-featured">Featured</span>
                    </td>
                    <td>
                      <button className="action-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn" title="History">
                        <FaHistory />
                      </button>
                      <button className="action-btn" title="Print Tag">
                        <FaTag />
                      </button>
                      <button className="action-btn danger" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-img">
                        <FaStar />
                      </div>
                    </td>
                    <td>Gold Bangle Set</td>
                    <td>GL-BGL-205</td>
                    <td>22K</td>
                    <td>24.5g</td>
                    <td>3</td>
                    <td>Bangles</td>
                    <td>
                      <span className="tag tag-premium">Premium</span>
                      <span className="tag tag-low-stock">Low Stock</span>
                    </td>
                    <td>
                      <button className="action-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn" title="History">
                        <FaHistory />
                      </button>
                      <button className="action-btn" title="Print Tag">
                        <FaTag />
                      </button>
                      <button className="action-btn danger" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-img">
                        <FaHeart />
                      </div>
                    </td>
                    <td>Emerald Earrings</td>
                    <td>GL-ERN-112</td>
                    <td>18K</td>
                    <td>3.5g</td>
                    <td>15</td>
                    <td>Earrings</td>
                    <td>
                      <span className="tag tag-new">New</span>
                    </td>
                    <td>
                      <button className="action-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn" title="History">
                        <FaHistory />
                      </button>
                      <button className="action-btn" title="Print Tag">
                        <FaTag />
                      </button>
                      <button className="action-btn danger" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="product-img">
                        <FaInfinity />
                      </div>
                    </td>
                    <td>Platinum Wedding Band</td>
                    <td>GL-RNG-078</td>
                    <td>Platinum</td>
                    <td>5.3g</td>
                    <td>7</td>
                    <td>Rings</td>
                    <td>
                      <span className="tag tag-featured">Featured</span>
                    </td>
                    <td>
                      <button className="action-btn" title="Edit">
                        <FaEdit />
                      </button>
                      <button className="action-btn" title="History">
                        <FaHistory />
                      </button>
                      <button className="action-btn" title="Print Tag">
                        <FaTag />
                      </button>
                      <button className="action-btn danger" title="Delete">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pagination">
              <div className="page-item active">1</div>
              <div className="page-item">2</div>
              <div className="page-item">3</div>
              <div className="page-item">4</div>
              <div className="page-item">5</div>
            </div>
          </div>

          {/* Summary */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Inventory Summary</h3>
            </div>

            <div className="kpi-grid">
              <div className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-title">Total Items</div>
                  <div className="kpi-icon">
                    <FaGem />
                  </div>
                </div>
                <div className="kpi-value">124</div>
                <div className="kpi-trend">
                  <FaArrowUp /> 8 new this week
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-title">Stock Value</div>
                  <div className="kpi-icon">
                    <FaDollarSign />
                  </div>
                </div>
                <div className="kpi-value">$892,350</div>
                <div className="kpi-trend down">
                  <FaArrowDown /> 2.1% from last month
                </div>
              </div>
              <div className="kpi-card">
                <div className="kpi-header">
                  <div className="kpi-title">Low Stock Items</div>
                  <div className="kpi-icon">
                    <FaExclamationTriangle />
                  </div>
                </div>
                <div className="kpi-value">7</div>
                <div className="kpi-trend">
                  <FaArrowUp /> Needs attention
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
