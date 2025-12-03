import React, {
  useCallback,
  useRef,
  type Dispatch,
  type SetStateAction,
} from "react";
import { FaArrowLeft, FaUndoAlt } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import { searchSales } from "../../../../apis/sales.api/sales.api";
import { SortDirection } from "../../../../types/enums";
import "./returnHeader.scss";

interface Sale {
  id: string;
  serialNumber: string;
  createdDate: string;
  customerName: string;
  customerPhone: string;
  staffName: string;
  total: number;
}

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  activeSearchTab: "receipt" | "phone" | "name";
  setActiveSearchTab: (v: "receipt" | "phone" | "name") => void;

  selectedSale: Sale | null;
  setSelectedSale: Dispatch<SetStateAction<Sale | null>>;

  onEnterPress: (value: string) => void;
  onBack: () => void;
}

const ReturnHeader: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  activeSearchTab,
  setActiveSearchTab,
  selectedSale,
  setSelectedSale,
  onEnterPress,
  onBack,
}) => {
  const debouncedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const resolversRef = useRef<Map<string, (value: any[]) => void>>(new Map());

  const performSearch = useCallback(
    async (inputValue: string): Promise<any[]> => {
      if (!inputValue) return [];

      try {
        const payload = {
          serialNumber: activeSearchTab === "receipt" ? inputValue : "",
          customerPhone: activeSearchTab === "phone" ? inputValue : "",
          customerName: activeSearchTab === "name" ? inputValue : "",
          pageSize: 10,
          pageNumber: 1,
          sortBy: "createdDate",
          sortDirection: SortDirection.Descending,
        };

        const response = await searchSales(payload);

        return (
          response.data?.map((sale: Sale) => ({
            label: `${sale.serialNumber}`,
            value: sale.id,
            data: sale,
          })) || []
        );
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    [activeSearchTab]
  );

  // Create debounced search that returns a promise
  const loadOptions = useCallback(
    (inputValue: string): Promise<any[]> => {
      return new Promise((resolve) => {
        // Clear existing timeout
        if (debouncedTimeoutRef.current) {
          clearTimeout(debouncedTimeoutRef.current);
        }

        // Store resolver for this input
        resolversRef.current.set(inputValue, resolve);

        // Set new debounced timeout
        debouncedTimeoutRef.current = setTimeout(async () => {
          const results = await performSearch(inputValue);
          const resolver = resolversRef.current.get(inputValue);
          if (resolver) {
            resolver(results);
            resolversRef.current.delete(inputValue);
          }
        }, 500);
      });
    },
    [performSearch]
  );

  return (
    <header className="return-header">
      {/* Logo */}
      <div className="logo">
        <FaUndoAlt />
        GoldCraft POS – Process Return
      </div>

      {/* Search Section */}
      <div className="search-section">
        {/* Tabs */}
        <div className="search-tabs">
          <div
            className={`search-tab ${
              activeSearchTab === "receipt" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSearchTab("receipt");
              setSearchQuery("");
              setSelectedSale(null);
            }}
          >
            Receipt #
          </div>
          <div
            className={`search-tab ${
              activeSearchTab === "phone" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSearchTab("phone");
              setSearchQuery("");
              setSelectedSale(null);
            }}
          >
            Phone
          </div>
          <div
            className={`search-tab ${
              activeSearchTab === "name" ? "active" : ""
            }`}
            onClick={() => {
              setActiveSearchTab("name");
              setSearchQuery("");
              setSelectedSale(null);
            }}
          >
            Name
          </div>
        </div>

        {/* Async Search Input */}
        <AsyncSelect
          className="search-input-async"
          cacheOptions
          loadOptions={loadOptions}
          components={{
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
          defaultOptions
          placeholder="Search sales..."
          noOptionsMessage={({ inputValue }) =>
            inputValue ? "No sales found" : "Type to search"
          }
          loadingMessage={() => "Searching..."}
          inputValue={searchQuery}
          onInputChange={(value) => {
            setSearchQuery(value);
          }}
          onChange={(selected) => {
            if (selected) {
              setSelectedSale(selected.data);
              onEnterPress(selected.data.id);
            } else {
              setSelectedSale(null);
              setSearchQuery("");
            }
          }}
          value={
            selectedSale
              ? {
                  label: `${selectedSale.serialNumber} - ${selectedSale.customerName}`,
                  value: selectedSale.id,
                  data: selectedSale,
                }
              : null
          }
          isClearable
          styles={{
            control: (base) => ({
              ...base,
              width: "100%",
              border: "1px solid #ccc",
              backgroundColor: "#f9f9f9",
              boxShadow: "none",
              "&:hover": {
                border: "1px solid #999",
                boxShadow: "none",
              },
            }),
            placeholder: (base) => ({
              ...base,
              color: "#999",
            }),
            singleValue: (base) => ({
              ...base,
              color: "#333",
            }),
            input: (base) => ({
              ...base,
              color: "#333",
              width: "100%",
            }),
            container: (base) => ({
              ...base,
              width: "100%",
              flex: 1,
            }),
            menu: (base) => ({
              ...base,
              marginTop: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            }),
            option: (base, state) => ({
              ...base,
              backgroundColor: state.isFocused ? "#e3f2fd" : "white",
              color: state.isFocused ? "#1976d2" : "#333",
              padding: "10px 12px",
              "&:hover": {
                backgroundColor: "#e3f2fd",
                color: "#1976d2",
              },
            }),
          }}
        />
      </div>

      {/* Back Button */}
      <button className="back-btn" onClick={onBack}>
        <FaArrowLeft /> Back to POS
      </button>
    </header>
  );
};

export default ReturnHeader;
