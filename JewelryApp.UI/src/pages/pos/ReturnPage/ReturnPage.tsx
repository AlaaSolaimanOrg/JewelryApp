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
  ReturnOption,
  ReturnReason,
} from "../../../types/enums";
import ConfirmReturnModal from "./ConfirmReturnModal/ConfirmReturnModal";
import "./ReturnPage.scss";
import SelectItemsToReturn from "./SelectItemsToReturn/SelectItemsToReturn";
import TransactionDetails from "./TransactionDetails/TransactionDetails";
import { checkRequestSucceeded, showSuccess } from "../../../utils";

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

const ReturnPage: React.FC = () => {
  // Navigation
  const navigate = useNavigate();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState<
    "receipt" | "phone" | "name"
  >("receipt");
  const [transactionVisible, setTransactionVisible] = useState(true);

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

  // Transaction data
  const transactionData = {
    receiptNumber: "GC-2023-001245",
    status: "Completed",
    date: "October 15, 2023",
    time: "2:45 PM",
    employee: "Sarah Johnson",
    customerName: "John Doe",
    customerPhone: "(555) 123-4567",
    totalAmount: 2215.17,
    paymentMethods: [
      { type: "Cash", amount: 1000.0 },
      { type: "Card", amount: 1215.17 },
    ],
  };

  // Handlers
  const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      setTransactionVisible(true);
      // In real app, fetch transaction data here
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
    if (!transactionVisible) {
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
        saleId: transactionData.receiptNumber, // Using receipt number as saleId
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

      // Reset form
      setTransactionVisible(false);
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
    } finally {
    }
  };
  const selectedItemsCount = items.filter((item) => item.selected).length;
  const totalReturnAmount = calculateTotalReturn();

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
            onKeyPress={handleSearchKeyPress}
          />
        </div>
        <button className="back-btn" onClick={() => navigate("/")}>
          <FaArrowLeft /> Back to POS
        </button>
      </header>

      {/* Transaction Details Section */}
      <TransactionDetails
        receiptNumber={transactionData.receiptNumber}
        status={transactionData.status}
        date={transactionData.date}
        time={transactionData.time}
        employee={transactionData.employee}
        customerName={transactionData.customerName}
        customerPhone={transactionData.customerPhone}
        totalAmount={transactionData.totalAmount}
        paymentMethods={transactionData.paymentMethods}
        isVisible={transactionVisible}
        onPrintReceipt={handlePrintReceipt}
        onViewDetails={handleViewDetails}
      />

      {/* Transaction Items Section */}
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

      {/* Footer Buttons */}
      <div className="footer-buttons">
        <button className="process-btn" onClick={handleProcessReturn}>
          <FaCheckCircle /> Process Return
        </button>
        <button className="cancel-btn" onClick={() => navigate("/")}>
          <FaTimesCircle /> Cancel
        </button>
      </div>

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
