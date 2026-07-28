import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { searchSales } from "../../../../apis/sales.api/sales.api";
import { SortDirection } from "../../../../types/enums";
import type { SearchSale, SearchTab } from "../ReturnPage.type";
import { formatCurrency } from "../ReturnPage.utils";
import "./searchScreen.scss";

interface SearchScreenProps {
  activeTab: SearchTab;
  onSelectSale: (sale: SearchSale) => void;
}

const TAB_PLACEHOLDER: Record<SearchTab, string> = {
  name: "Search by customer name...",
  phone: "Search by phone number...",
  receipt: "Search by receipt number...",
};

const SearchScreen = ({ activeTab, onSelectSale }: SearchScreenProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchSale[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  }, [activeTab]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const payload = {
          serialNumber: activeTab === "receipt" ? query : "",
          customerPhone: activeTab === "phone" ? query : "",
          customerName: activeTab === "name" ? query : "",
          pageSize: 20,
          pageNumber: 1,
          sortBy: "createdDate",
          sortDirection: SortDirection.Descending,
        };
        const response = await searchSales(payload);
        setResults(response.data ?? []);
      } catch (err) {
        console.error(err);
        setResults([]);
      } finally {
        setHasSearched(true);
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeTab]);

  return (
    <div className="rp-search-screen">
      <div className="rp-search-top">
        <div className="rp-search-wrap">
          <FaSearch className="rp-search-ico" />
          <input
            type="text"
            className="rp-search-input"
            placeholder={TAB_PLACEHOLDER[activeTab]}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            autoFocus
          />
        </div>
      </div>

      <div className="rp-result-count">
        {hasSearched &&
          `${results.length} transaction${results.length !== 1 ? "s" : ""} found`}
      </div>

      <div className="rp-results-list">
        {!query.trim() ? (
          <div className="rp-no-results">Enter a search term to find transactions</div>
        ) : hasSearched && !results.length ? (
          <div className="rp-no-results">No transactions found</div>
        ) : (
          results.map((sale) => (
            <div
              key={sale.id}
              className="rp-result-card"
              onClick={() => onSelectSale(sale)}
            >
              <div>
                <div className="rp-result-date">
                  {new Date(sale.createdDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="rp-result-desc">
                  {sale.customerName} — {sale.customerPhone}
                </div>
              </div>
              <div className="rp-result-right">
                <div className="rp-result-amount">{formatCurrency(sale.total)}</div>
                <div className="rp-result-id">{sale.serialNumber}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SearchScreen;
