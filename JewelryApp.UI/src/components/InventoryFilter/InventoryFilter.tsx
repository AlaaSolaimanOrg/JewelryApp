import { useState } from "react";
import { FaFilter, FaRedo } from "react-icons/fa";
import "./inventoryFilter.scss";
import { KaratType, ProductCategory } from "../../types/enums";

export interface InventoryFilters {
  karatTypes: KaratType[];
  weightFrom: number;
  weightTo: number;
  priceFrom: number;
  priceTo: number;
  category: ProductCategory | null;
  inStock: boolean | null;
}

const filtersInitialState: InventoryFilters = {
  karatTypes: [
    KaratType.Karat18,
    KaratType.Karat21,
    KaratType.Karat22,
    KaratType.Karat24,
  ],
  weightFrom: 0,
  weightTo: 9999,
  priceFrom: 0,
  priceTo: 999999,
  category: null,
  inStock: null,
};

interface InventoryFilterProps {
  setAppliedFilters: (filters: InventoryFilters) => void;
}

const InventoryFilter = ({ setAppliedFilters }: InventoryFilterProps) => {
  const [filters, setFilters] = useState<InventoryFilters>(filtersInitialState);
  const [isOpen, setIsOpen] = useState(false);

  const toggleValueInArray = (array: any[], currentValue: any): any[] => {
    return array.includes(currentValue)
      ? array.filter((oldValue) => oldValue !== currentValue)
      : [...array, currentValue];
  };

  const handleFilterChange = (key: keyof InventoryFilters, value: any) => {
    setFilters((prev) => {
      if (key === "karatTypes") {
        return {
          ...prev,
          [key]: toggleValueInArray(prev[key] as any[], value),
        };
      }
      return { ...prev, [key]: value };
    });
  };

  const resetFilters = () => {
    setFilters(filtersInitialState);
    setAppliedFilters(filtersInitialState);
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
  };

  const karatOptions = [
    { label: "18K", value: KaratType.Karat18 },
    { label: "21K", value: KaratType.Karat21 },
    { label: "22K", value: KaratType.Karat22 },
    { label: "24K", value: KaratType.Karat24 },
  ];

  return (
    <div className="filter-sidebar">
      {/* MOBILE COLLAPSE BUTTON */}

      <div className="filter-header">
        <h3 className="filter-title">
          <FaFilter className="icon" /> Filter Inventory
        </h3>

        <button className="collapse-toggle" onClick={() => setIsOpen(!isOpen)}>
          <FaFilter /> Filters {isOpen ? "▲" : "▼"}
        </button>
      </div>

      <div className={`filter-content ${isOpen ? "open" : ""}`}>
        {/* Main Filter Grid */}
        <div className="filter-grid">
          {/* Karat Types - Now compact with Category */}
          <div className="filter-group karat-group">
            <span className="filter-group-title">Karat</span>
            <div className="karat-checkboxes">
              {karatOptions.map((karatOption) => (
                <div className="filter-option" key={karatOption.label}>
                  <input
                    type="checkbox"
                    id={karatOption.label}
                    checked={filters.karatTypes.includes(karatOption.value)}
                    onChange={() =>
                      handleFilterChange("karatTypes", karatOption.value)
                    }
                  />
                  <label htmlFor={karatOption.label}>
                    <span className="checkbox-custom"></span>
                    {karatOption.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Category - Now side by side with Karat */}
          <div className="filter-group category-group">
            <span className="filter-group-title">Category</span>
            <select
              className="form-control"
              value={filters.category ?? ""}
              onChange={(e) =>
                handleFilterChange(
                  "category",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
            >
              <option value="">All Categories</option>
              {Object.entries(ProductCategory)
                .filter(([_, value]) => typeof value === "number")
                .map(([key, value]) => (
                  <option key={value} value={value}>
                    {key}
                  </option>
                ))}
            </select>
          </div>

          <div className="filter-group stock-group">
            <span className="filter-group-title">Stock Status</span>
            <select
              className="form-control"
              value={
                filters.inStock === null
                  ? "all"
                  : filters.inStock
                    ? "inStock"
                    : "outOfStock"
              }
              onChange={(e) =>
                handleFilterChange(
                  "inStock",
                  e.target.value === "all"
                    ? null
                    : e.target.value === "inStock",
                )
              }
            >
              <option value="all">Show All</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Weight Range */}
          <div className="filter-group weight-group">
            <span className="filter-group-title">Weight (g)</span>
            <div className="range-inputs">
              <input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
                max={filters.weightTo}
                value={filters.weightFrom || ""}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  if (val <= filters.weightTo)
                    handleFilterChange("weightFrom", val);
                }}
                className="form-control"
                placeholder="Min"
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                min={filters.weightFrom}
                max={9999}
                value={filters.weightTo || ""}
                onChange={(e) => {
                  const val =
                    e.target.value === "" ? 0 : Number(e.target.value);
                  if (val >= filters.weightFrom)
                    handleFilterChange("weightTo", val);
                }}
                className="form-control"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Price Range */}
          <div className="filter-group price-group">
            <span className="filter-group-title">Price ($)</span>
            <div className="range-inputs">
              <input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                min={0}
                max={filters.priceTo}
                value={filters.priceFrom}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val <= filters.priceTo)
                    handleFilterChange("priceFrom", val);
                }}
                className="form-control"
                placeholder="Min"
              />
              <span className="range-separator">to</span>
              <input
                type="number"
                onWheel={(e) => e.currentTarget.blur()}
                min={filters.priceFrom}
                max={999999}
                value={filters.priceTo}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  if (val >= filters.priceFrom)
                    handleFilterChange("priceTo", val);
                }}
                className="form-control"
                placeholder="Max"
              />
            </div>
          </div>

          {/* Action Buttons - Desktop only */}
          <div className="filter-group actions-group">
            <span className="filter-group-title invisible">Actions</span>
            <div className="action-buttons">
              <button className="btn-sm btn-gold" onClick={applyFilters}>
                <FaFilter className="me-1" /> Apply
              </button>
              <button className="btn-sm btn-dark" onClick={resetFilters}>
                <FaRedo className="me-1" /> Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilter;
