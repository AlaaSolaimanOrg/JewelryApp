import { useState } from "react";
import { FaFilter, FaRedo } from "react-icons/fa";
import "./inventoryFilterSideBar.scss";
import { KaratType } from "../../types/enums";

export interface InventoryFilters {
  karat: KaratType[];
  weight: number;
  category: string;
  ringSize: string;
  necklaceLength: string;
  tags: string[];
}

const InventoryFilterSideBar = ({ setAppliedFilters }) => {
  const [filters, setFilters] = useState<InventoryFilters>({
    karat: [KaratType.Karat18, KaratType.Karat21, KaratType.Karat24],
    weight: 15,
    category: "All Categories",
    ringSize: "Any",
    necklaceLength: "Any",
    tags: [],
  });

  const toggleValueInArray = (array, currentValue): string[] => {
    return array.includes(currentValue)
      ? array.filter((oldValue) => oldValue !== currentValue)
      : [...array, currentValue];
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (key === "karat" || key === "tags") {
        return { ...prev, [key]: toggleValueInArray(prev[key], value) };
      }
      return { ...prev, [key]: value };
    });
  };

  const resetFilters = () => {
    setFilters({
      karat: ["18K Gold", "21K Gold"],
      weight: 15,
      category: "All Categories",
      ringSize: "Any",
      necklaceLength: "Any",
      tags: [],
    });
  };
  const karatOptions = [
    { label: "18K Gold", value: KaratType.Karat18 },
    { label: "21K Gold", value: KaratType.Karat21 },
    { label: "24K Gold", value: KaratType.Karat24 },
  ];
  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">
        <FaFilter className="me-2" /> Filter Inventory
      </h3>

      {/* Karat */}
      <div className="filter-group">
        <span className="filter-group-title">Karat</span>
        {karatOptions.map((karatOption) => (
          <div className="filter-option" key={karatOption.label}>
            <input
              type="checkbox"
              id={karatOption.label}
              checked={filters.karat.some(
                (karatValue) => karatValue == karatOption.value
              )}
              onChange={() => handleFilterChange("karat", karatOption.value)}
            />
            <label htmlFor={karatOption.label}>{karatOption.label}</label>
          </div>
        ))}
      </div>

      {/* Weight */}
      <div className="filter-group">
        <span className="filter-group-title">Weight (grams)</span>
        <div className="range-slider">
          <input
            type="range"
            min="0"
            max="50"
            value={filters.weight}
            className="slider"
            onChange={(e) =>
              handleFilterChange("weight", Number(e.target.value))
            }
          />
        </div>
        <div className="slider-values">
          <span>0g</span>
          <span>{filters.weight}g</span>
          <span>50g</span>
        </div>
      </div>

      {/* Category */}
      <div className="filter-group">
        <span className="filter-group-title">Category</span>
        <select
          className="form-control"
          value={filters.category}
          onChange={(e) => handleFilterChange("category", e.target.value)}
        >
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
              <select
                className="form-control"
                value={filters.ringSize}
                onChange={(e) => handleFilterChange("ringSize", e.target.value)}
              >
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
              <select
                className="form-control"
                value={filters.necklaceLength}
                onChange={(e) =>
                  handleFilterChange("necklaceLength", e.target.value)
                }
              >
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
        {["New Arrivals", "Featured", "Premium Collection", "Low Stock"].map(
          (t) => (
            <div className="filter-option" key={t}>
              <input
                type="checkbox"
                id={t}
                checked={filters.tags.includes(t)}
                onChange={() => handleFilterChange("tags", t)}
              />
              <label htmlFor={t}>{t}</label>
            </div>
          )
        )}
      </div>

      {/* Buttons */}
      <div className="form-group" style={{ marginTop: "20px" }}>
        <button
          className="btn-md btn-gold"
          style={{ width: "100%" }}
          onClick={() => setAppliedFilters(filters)}
        >
          <FaFilter className="me-1" /> Apply Filters
        </button>
        <button
          className="btn-md btn-gray"
          style={{ width: "100%", marginTop: "10px" }}
          onClick={resetFilters}
        >
          <FaRedo className="me-1" /> Reset Filters
        </button>
      </div>
    </div>
  );
};

export default InventoryFilterSideBar;
