import React from "react";
import { FaArrowLeft, FaUndoAlt } from "react-icons/fa";
import "./returnHeader.scss";

interface Props {
  searchQuery: string;
  setSearchQuery: (v: string) => void;

  activeSearchTab: "receipt" | "phone" | "name";
  setActiveSearchTab: (v: "receipt" | "phone" | "name") => void;

  onEnterPress: (value: string) => void;
  onBack: () => void;
}

const ReturnHeader: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
  activeSearchTab,
  setActiveSearchTab,
  onEnterPress,
  onBack,
}) => {
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
            onClick={() => setActiveSearchTab("receipt")}
          >
            Receipt #
          </div>
          <div
            className={`search-tab ${
              activeSearchTab === "phone" ? "active" : ""
            }`}
            onClick={() => setActiveSearchTab("phone")}
          >
            Phone
          </div>
          <div
            className={`search-tab ${
              activeSearchTab === "name" ? "active" : ""
            }`}
            onClick={() => setActiveSearchTab("name")}
          >
            Name
          </div>
        </div>

        {/* Input */}
        <input
          type="text"
          className="search-input"
          placeholder="Search transaction..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchQuery.trim() !== "") {
              onEnterPress(searchQuery);
            }
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
