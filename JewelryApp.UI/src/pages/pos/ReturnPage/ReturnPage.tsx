import React, { useState, type KeyboardEvent } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaUndoAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { createReturn } from "../../../apis/returns.api/returns.api";
import type {
  ItemCondition,
  KaratType,
  ReturnOption,
  ReturnReason,
} from "../../../types/enums";
import ConfirmReturnModal from "./ConfirmReturnModal/ConfirmReturnModal";
import "./ReturnPage.scss";
import SelectItemsToReturn from "./SelectItemsToReturn/SelectItemsToReturn";
import TransactionDetails from "./TransactionDetails/TransactionDetails";
import { checkRequestSucceeded, showSuccess } from "../../../utils";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";

interface TransactionItem {
  id: number;
  name: string;
  icon: "ring" | "gem";
  karat: string;
  weight: string;
  unitPrice: number;
  qtyPurchased: number;
  qtyToReturn: number;
  returnAmount: number;
  selected: boolean;
  returnReason: string;
  otherReason: string;
  condition: "good" | "needs_polishing" | "damaged" | "";
  returnOption: "return_to_stock" | "melt_after_return" | "";
}

interface Sale {
  id: string;
  serialNumber: string;
  createdDate: string;
  staffName: string;
  customerName: string;
  customerPhone: string;
  total: number;
  cashAmount: number;
  cardAmount: number;
  tax: number;
  discount: number;
  saleItems: SaleItem[];
}

interface SaleItem {
  productName: string;
  sku: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotal: number;
  quantity: number;
}
const ReturnPage: React.FC = () => {
  // Navigation
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState<
    "receipt" | "phone" | "name"
  >("receipt");

  const [items, setItems] = useState<TransactionItem[]>([
    {
      id: 1,
      name: "Diamond Solitaire Ring",
      icon: "ring",
      karat: "21K",
      weight: "3.5g",
      unitPrice: 440.13,
      qtyPurchased: 1,
      qtyToReturn: 1,
      returnAmount: 440.13,
      selected: true,
      returnReason: "",
      otherReason: "",
      condition: "",
      returnOption: "",
    },
    {
      id: 2,
      name: "Gold Tennis Bracelet",
      icon: "gem",
      karat: "18K",
      weight: "8.2g",
      unitPrice: 920.68,
      qtyPurchased: 1,
      qtyToReturn: 0,
      returnAmount: 0,
      selected: false,
      returnReason: "",
      otherReason: "",
      condition: "",
      returnOption: "",
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);

  const { data: saleDetails } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { serialNumber: searchBy },
    extraEffectCheck: !!searchBy && activeSearchTab == "receipt",
    effectDependency: [searchBy],
    dataInitalValue: null,
  }) as {
    data: Sale;
    fetchData: () => void;
  };

  const hasSearched = searchBy.trim() !== "";
  const transactionNotFound = hasSearched && !saleDetails;

  console.log("saleDetails", saleDetails);
  console.log("searchBy", searchBy);
  // Handlers
  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    console.log("event", e);
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setSearchBy(searchQuery);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const selected = !item.selected;
          return {
            ...item,
            selected,
            qtyToReturn: selected ? item.qtyPurchased : 0,
            returnAmount: selected ? item.unitPrice * item.qtyPurchased : 0,
            returnReason: selected ? item.returnReason : "",
            otherReason: selected ? item.otherReason : "",
            condition: selected ? item.condition : "",
            returnOption: selected ? item.returnOption : "",
          };
        }
        return item;
      })
    );
  };

  const handleReturnOptionChange = (
    id: number,
    option: "return_to_stock" | "melt_after_return"
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            returnOption: option,
          };
        }
        return item;
      })
    );
  };

  const handleConditionChange = (
    id: number,
    condition: "good" | "needs_polishing" | "damaged"
  ) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            condition,
          };
        }
        return item;
      })
    );
  };

  const handleReturnReasonChange = (id: number, value: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            returnReason: value,
            otherReason: value === "other" ? item.otherReason : "",
          };
        }
        return item;
      })
    );
  };

  const handleOtherReasonChange = (id: number, value: string) => {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            otherReason: value,
          };
        }
        return item;
      })
    );
  };

  const handleQuantityChange = (id: number, value: string) => {
    const qty = Math.max(0, parseInt(value) || 0);
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const validQty = Math.min(qty, item.qtyPurchased);
          return {
            ...item,
            qtyToReturn: validQty,
            returnAmount: item.unitPrice * validQty,
            selected: validQty > 0,
          };
        }
        return item;
      })
    );
  };

  const calculateTotalReturn = (): number => {
    return items.reduce((sum, item) => sum + item.returnAmount, 0);
  };

  const handlePrintReceipt = () => {
    // Implement print receipt functionality
    console.log("Printing receipt...");
  };

  const handleViewDetails = () => {
    // Implement view details functionality
    console.log("Viewing transaction details...");
  };

  const handleProcessReturn = () => {
    // Validation
    if (!saleDetails) {
      alert("Please search for and select a transaction first.");
      return;
    }

    const hasSelectedItems = items.some((item) => item.selected);
    if (!hasSelectedItems) {
      alert("Please select at least one item to return.");
      return;
    }

    // Check if all selected items have return reasons
    const selectedItems = items.filter((item) => item.selected);
    const hasMissingReasons = selectedItems.some((item) => !item.returnReason);
    const hasMissingOtherReasons = selectedItems.some(
      (item) => item.returnReason === "other" && !item.otherReason.trim()
    );
    const hasMissingConditions = selectedItems.some((item) => !item.condition);
    const hasMissingOptions = selectedItems.some((item) => !item.returnOption);

    if (hasMissingReasons) {
      alert("Please select a return reason for all selected items.");
      return;
    }

    if (hasMissingOtherReasons) {
      alert('Please specify the return reason for items marked as "Other".');
      return;
    }

    if (hasMissingConditions) {
      alert("Please select the condition for all selected items.");
      return;
    }

    if (hasMissingOptions) {
      alert("Please select a return option for all selected items.");
      return;
    }

    setModalVisible(true);
  };

  const handleConfirmReturn = async () => {
    try {
      // Prepare payload for API
      const payload = {
        saleId: saleDetails.serialNumber, // Using receipt number as saleId
        items: items
          .filter((item) => item.selected && item.qtyToReturn > 0)
          .map((item) => ({
            saleItemId: item.id.toString(),
            quantityToReturn: item.qtyToReturn,
            reason: item.returnReason as ReturnReason,
            reasonNote:
              item.returnReason === "other" ? item.otherReason : undefined,
            returnAmount: item.returnAmount,
            condition: item.condition as ItemCondition,
            option: item.returnOption as ReturnOption,
          })),
      };

      // Call the API
      const response = await createReturn(payload);
      if (checkRequestSucceeded(response.status)) {
        showSuccess(response?.message);
      }

      // Handle success
      alert(
        "Return processed successfully! A return receipt has been generated."
      );
      setModalVisible(false);

      setItems(
        items.map((item) => ({
          ...item,
          selected: false,
          qtyToReturn: 0,
          returnAmount: 0,
          returnReason: "",
          otherReason: "",
          condition: "",
          returnOption: "",
        }))
      );
    } catch (error) {
      console.error("Error processing return:", error);
      alert("Failed to process return. Please try again.");
    }
  };
  const selectedItemsCount = items.filter((item) => item.selected).length;
  const totalReturnAmount = calculateTotalReturn();

  // Format date & time from createdDate
  const formattedDate = saleDetails
    ? new Date(saleDetails.createdDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  const formattedTime = saleDetails
    ? new Date(saleDetails.createdDate).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "";

  return (
    <div className="return-page-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <FaUndoAlt />
          GoldCraft POS - Process Return
        </div>
        <div className="search-section">
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
          <input
            type="text"
            className="search-input"
            placeholder="Search transaction..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyPress}
          />
        </div>
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to POS
        </button>
      </header>

      {/* Show BEFORE search */}
      {!hasSearched && (
        <div className="no-transaction-box">
          <h3>Search for a transaction to begin</h3>
          <p>Enter a receipt number, phone, or customer name.</p>
        </div>
      )}

      {/* Show AFTER search but NOT found */}
      {transactionNotFound && (
        <div className="no-transaction-box not-found">
          <h3>No transaction found</h3>
          <p>Please check the value you entered and try again.</p>
        </div>
      )}

      {!!saleDetails && (
        <section>
          <TransactionDetails
            saleId={saleDetails?.id}
            receiptNumber={saleDetails?.serialNumber}
            status="Completed"
            date={formattedDate}
            time={formattedTime}
            employee={saleDetails?.staffName}
            customerName={saleDetails?.customerName}
            customerPhone={saleDetails?.customerPhone}
            totalAmount={saleDetails?.total}
            paymentMethods={[
              { type: "Cash", amount: saleDetails?.cashAmount },
              { type: "Card", amount: saleDetails?.cardAmount },
            ]}
            onViewDetails={handleViewDetails}
          />

          <SelectItemsToReturn
            items={items}
            onCheckboxChange={handleCheckboxChange}
            onQuantityChange={handleQuantityChange}
            onReturnReasonChange={handleReturnReasonChange}
            onOtherReasonChange={handleOtherReasonChange}
            onConditionChange={handleConditionChange}
            onReturnOptionChange={handleReturnOptionChange}
            totalReturnAmount={totalReturnAmount}
          />

          <div className="footer-buttons">
            <button className="process-btn" onClick={handleProcessReturn}>
              <FaCheckCircle /> Process Return
            </button>
            <button className="cancel-btn" onClick={() => navigate("/")}>
              <FaTimesCircle /> Cancel
            </button>
          </div>
        </section>
      )}

      <ConfirmReturnModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmReturn}
        selectedItemsCount={selectedItemsCount}
        totalReturnAmount={totalReturnAmount}
      />
    </div>
  );
};

export default ReturnPage;
