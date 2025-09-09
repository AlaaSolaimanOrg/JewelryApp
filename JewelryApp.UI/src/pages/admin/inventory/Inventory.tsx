import {
  FaArrowDown,
  FaArrowUp,
  FaBox,
  FaDollarSign,
  FaEdit,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaEye,
  FaFileExport,
  FaGem,
  FaHeart,
  FaHistory,
  FaInfinity,
  FaPlus,
  FaRing,
  FaSearch,
  FaStar,
  FaTag,
  FaTags,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../../../apis/products.api/products.api";
import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import type { KaratType, ProductCategory } from "../../../types/enums";
import "./inventory.scss";
import InventoryFilterSideBar from "../../../components/InventoryFilterSideBar/InventoryFilterSideBar";
import CustomTable from "../../../components/Table/CustomTable";

interface Product {
  id: string; // Guid -> string
  sku: string; // string
  name?: string | null; // string? -> optional
  karatType: KaratType; // enum
  weight: number; // decimal -> number
  category: ProductCategory; // enum
  images: string[]; // list
}

const Inventory = () => {
  const navigate = useNavigate();

  const {
    data: products,
    onSearchChange,
    onPaginationChange,
    onPageSizeChange,
    onSortChange,
    isLoading: isLoadingUsers,
    pagination,
    searchBy,
  } = useLocalApiSearchSortPagination<Product>({
    apiToCall: (data) => getProducts(data.payload),
    extraPayload: {},
  });

  console.log("products", products);

  const headers = [
    "Name",
    "Phone",
    "Email",
    "Total Spent",
    "Last Purchase",
    "Actions",
  ];

  const data = [
    {
      Name: "Sarah Johnson",
      Phone: "(555) 123-4567",
      Email: "sarah@example.com",
      TotalSpent: "$24,560",
      LastPurchase: "Oct 28, 2023",
      Actions: (
        <>
          <button className="action-btn" title="View">
            <FaEye />
          </button>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
    {
      Name: "Michael Chen",
      Phone: "(555) 987-6543",
      Email: "michael@example.com",
      TotalSpent: "$18,340",
      LastPurchase: "Oct 27, 2023",
      Actions: (
        <>
          <button className="action-btn" title="View">
            <FaEye />
          </button>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
    {
      Name: "Emma Rodriguez",
      Phone: "(555) 456-7890",
      Email: "emma@example.com",
      TotalSpent: "$15,670",
      LastPurchase: "Oct 25, 2023",
      Actions: (
        <>
          <button className="action-btn" title="View">
            <FaEye />
          </button>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
    {
      Name: "David Wilson",
      Phone: "(555) 234-5678",
      Email: "david@example.com",
      TotalSpent: "$12,890",
      LastPurchase: "Oct 24, 2023",
      Actions: (
        <>
          <button className="action-btn" title="View">
            <FaEye />
          </button>
          <button className="action-btn" title="Edit">
            <FaEdit />
          </button>
          <button className="action-btn danger" title="Delete">
            <FaTrash />
          </button>
        </>
      ),
    },
  ];

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
        <InventoryFilterSideBar />
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
        <CustomTable data={data} headers={headers} />
      </div>
    </div>
  );
};

export default Inventory;
