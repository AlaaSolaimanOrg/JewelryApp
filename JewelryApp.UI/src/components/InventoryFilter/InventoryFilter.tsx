import { useState } from "react";
import { FaFilter, FaRedo } from "react-icons/fa";
import { KaratType, ProductCategory } from "../../types/enums";
import "./inventoryFilter.scss";

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
  const [filters, setFilters] = useState<InventoryFilters>(
    filtersInitialState,
  );

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
    <div className="panel invFilterPanel">
      <div className="filter-grid">
        <div>
          <span className="f-label">Karat</span>
          <div className="karat-checks">
            {karatOptions.map((karatOption) => (
              <label className="kcheck" key={karatOption.label}>
                <input
                  type="checkbox"
                  checked={filters.karatTypes.includes(karatOption.value)}
                  onChange={() =>
                    handleFilterChange("karatTypes", karatOption.value)
                  }
                />
                {karatOption.label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="f-label">Category</span>
          <select
            className="f-select"
            value={filters.category ?? ""}
            onChange={(e) =>
              handleFilterChange(
                "category",
                e.target.value === "" ? null : Number(e.target.value),
              )
            }
          >
            <option value="">All categories</option>
            {Object.entries(ProductCategory)
              .filter(([, value]) => typeof value === "number")
              .map(([key, value]) => (
                <option key={value} value={value}>
                  {key}
                </option>
              ))}
          </select>
        </div>

        <div>
          <span className="f-label">Stock status</span>
          <select
            className="f-select"
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
                e.target.value === "all" ? null : e.target.value === "inStock",
              )
            }
          >
            <option value="all">Show all</option>
            <option value="inStock">In stock</option>
            <option value="outOfStock">Out of stock</option>
          </select>
        </div>

        <div>
          <span className="f-label">Weight (g)</span>
          <div className="range-row">
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={0}
              max={filters.weightTo}
              value={filters.weightFrom || ""}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                if (val <= filters.weightTo)
                  handleFilterChange("weightFrom", val);
              }}
              className="f-input"
              placeholder="Min"
            />
            <span className="range-sep">to</span>
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={filters.weightFrom}
              max={9999}
              value={filters.weightTo || ""}
              onChange={(e) => {
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                if (val >= filters.weightFrom)
                  handleFilterChange("weightTo", val);
              }}
              className="f-input"
              placeholder="Max"
            />
          </div>
        </div>

        <div>
          <span className="f-label">Price ($)</span>
          <div className="range-row">
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
              className="f-input"
              placeholder="Min"
            />
            <span className="range-sep">to</span>
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
              className="f-input"
              placeholder="Max"
            />
          </div>
        </div>

        <div className="filter-actions-col">
          <span className="f-label">&nbsp;</span>
          <div className="filter-btns">
            <button className="btn-md btn-gold" onClick={applyFilters}>
              <FaFilter /> Apply
            </button>
            <button className="btn-md btn-outline" onClick={resetFilters}>
              <FaRedo /> Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryFilter;
