import { useState } from "react";
import { FaFilter, FaRedo } from "react-icons/fa";
import "./inventoryFilterSideBar.scss";
import { KaratType, ProductCategory } from "../../types/enums";

export interface InventoryFilters {
  karatTypes: KaratType[];
  weightFrom: number;
  weightTo: number;
  priceFrom: number;
  priceTo: number;
  category: ProductCategory | null;
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
};

const InventoryFilterSideBar = ({
  setAppliedFilters,
}: {
  setAppliedFilters: (filters: InventoryFilters) => void;
}) => {
  const [filters, setFilters] = useState<InventoryFilters>(filtersInitialState);

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

  const karatOptions = [
    { label: "18K Gold", value: KaratType.Karat18 },
    { label: "21K Gold", value: KaratType.Karat21 },
    { label: "22K Gold", value: KaratType.Karat22 },
    { label: "24K Gold", value: KaratType.Karat24 },
  ];

  return (
    <div className="filter-sidebar">
      <h3 className="filter-title">
        <FaFilter className="me-2 icon" /> Filter Inventory
      </h3>

      <div className="filter-group">
        <span className="filter-group-title">Karat</span>
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
            <label htmlFor={karatOption.label}>{karatOption.label}</label>
          </div>
        ))}
      </div>

      <div className="filter-group">
        <span className="filter-group-title">Weight (grams)</span>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label">From</label>
            <input
              type="number"
              min={0}
              max={filters.weightTo}
              value={filters.weightFrom || ""}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                if (val <= filters.weightTo)
                  handleFilterChange("weightFrom", val);
              }}
              className="form-control"
              placeholder="0"
            />
          </div>
          <div className="form-col">
            <label className="form-label">To</label>
            <input
              type="number"
              min={filters.weightFrom}
              max={9999}
              value={filters.weightTo || ""}
              onChange={(e) => {
                if (e.target.value.length > 4) return;
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                handleFilterChange("weightTo", val);
              }}
              className="form-control"
              placeholder="9999"
            />
          </div>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-title">Price</span>
        <div className="form-row">
          <div className="form-col">
            <label className="form-label">From</label>
            <input
              type="number"
              min={0}
              max={filters.priceTo}
              value={filters.priceFrom}
              onChange={(e) => {
                const val = Number(e.target.value);
                if (val <= filters.priceTo)
                  handleFilterChange("priceFrom", val);
              }}
              className="form-control"
            />
          </div>
          <div className="form-col">
            <label className="form-label">To</label>
            <input
              type="number"
              min={filters.priceFrom}
              max={999999}
              value={filters.priceTo}
              onChange={(e) => {
                if (e.target.value.length > 9) {
                  return;
                }
                handleFilterChange("priceTo", Number(e.target.value));
              }}
              className="form-control"
            />
          </div>
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-group-title">Category</span>
        <select
          className="form-control"
          value={filters.category ?? ""}
          onChange={(e) =>
            handleFilterChange(
              "category",
              e.target.value === "" ? null : Number(e.target.value)
            )
          }
        >
          <option value="">Category</option>
          {Object.entries(ProductCategory)
            .filter(([_, value]) => typeof value === "number")
            .map(([key, value]) => (
              <option key={value} value={value}>
                {key}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group" style={{ marginTop: "20px" }}>
        <button
          className="btn-md btn-gold"
          style={{ width: "100%" }}
          onClick={() => {setAppliedFilters(filters)}}
        >
          <FaFilter className="me-1" /> Apply Filters
        </button>
        <button
          className="btn-md btn-dark"
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
