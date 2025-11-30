import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { createReturn } from "../../../apis/returns.api/returns.api";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";

import {
  ReturnReason,
  type ItemCondition,
  type KaratType,
  type ReturnOption,
} from "../../../types/enums";

import { checkRequestSucceeded, showSuccess } from "../../../utils";

import ConfirmReturnModal from "./ConfirmReturnModal/ConfirmReturnModal";
import SelectItemsToReturn from "./SelectItemsToReturn/SelectItemsToReturn";
import TransactionDetails from "./TransactionDetails/TransactionDetails";

import ReturnHeader from "./ReturnHeader/ReturnHeader";
import "./ReturnPage.scss";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";

export interface TransactionItem {
  id: string;
  name: string;
  icon: "ring" | "gem";
  karat: KaratType;
  weight: string;
  unitPrice: number;
  qtyPurchased: number;
  qtyToReturn: number;
  returnAmount: number;
  selected: boolean;
  returnReason: ReturnReason | null;
  otherReason: string;
  condition: ItemCondition | null;
  returnOption: ReturnOption | null;
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
  id: string;
  productName: string;
  sku: string;
  karat: KaratType;
  weight: number;
  pricePerGram: number;
  subtotal: number;
  quantity: number;
}

const ReturnPage: React.FC = () => {
  const navigate = useNavigate();

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [activeSearchTab, setActiveSearchTab] = useState<
    "receipt" | "phone" | "name"
  >("receipt");

  // Item validation errors
  const [itemErrors, setItemErrors] = useState<{ [key: number]: string[] }>({});

  // Return items
  const [items, setItems] = useState<TransactionItem[]>([]);

  // Modal visibility
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch sale details
  const {
    data: saleDetails,
    setData: setSaleDetails,
    isLoading: isLoadingSale,
  } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { serialNumber: searchBy },
    extraEffectCheck: !!searchBy && activeSearchTab === "receipt",
    effectDependency: [searchBy],
    dataInitalValue: null,
  }) as {
    data: Sale;
    setData: React.Dispatch<React.SetStateAction<Sale | null>>;
    isLoading: boolean;
  };

  const hasSearched = searchBy.trim() !== "";
  const transactionNotFound = hasSearched && !saleDetails;

  useEffect(() => {
    if (!searchQuery) {
      setSearchBy("");
      setSaleDetails(null);
    }
  }, [searchQuery, setSaleDetails]);

  useEffect(() => {
    if (!saleDetails) return;

    const mappedItems: TransactionItem[] = saleDetails.saleItems.map(
      (item) => ({
        id: item.id,
        name: item.productName,
        icon: item.productName.toLowerCase().includes("ring") ? "ring" : "gem",
        karat: item.karat,
        weight: item.weight + "g",
        unitPrice: item.subtotal / item.quantity,
        qtyPurchased: item.quantity,
        qtyToReturn: 0,
        returnAmount: 0,
        selected: false,

        // user-entry fields
        returnReason: null,
        otherReason: "",
        condition: null,
        returnOption: null,
      })
    );

    setItems(mappedItems);
  }, [saleDetails]);

  // -----------------------------
  // ITEM STATE HANDLERS
  // -----------------------------

  const handleCheckboxChange = (id: string) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
              qtyToReturn: !item.selected ? item.qtyPurchased : 0,
              returnAmount: !item.selected
                ? item.unitPrice * item.qtyPurchased
                : 0,
            }
          : item
      )
    );
  };

  const handleReturnOptionChange = (
    id: string,
    option: ReturnOption | null
  ) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, returnOption: option } : item
      )
    );
  };

  const handleConditionChange = (
    id: string,
    condition: ItemCondition | null
  ) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, condition } : item))
    );
  };

  const handleReturnReasonChange = (id: string, value: ReturnReason | null) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              returnReason: value,
              otherReason: value === ReturnReason.Other ? item.otherReason : "",
            }
          : item
      )
    );
  };

  const handleOtherReasonChange = (id: string, value: string) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, otherReason: value } : item
      )
    );
  };

  const handleQuantityChange = (id: string, value: string) => {
    const qty = Math.max(0, parseInt(value) || 0);

    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const validQty = Math.min(qty, item.qtyPurchased);

        return {
          ...item,
          qtyToReturn: validQty,
          returnAmount: validQty * item.unitPrice,
          selected: validQty > 0,
        };
      })
    );
  };

  const calculateTotalReturn = () =>
    items.reduce((sum, item) => sum + item.returnAmount, 0);

  // -----------------------------
  // VALIDATION LOGIC
  // -----------------------------

  const validateItems = () => {
    const errors: { [key: number]: string[] } = {};

    items.forEach((item) => {
      if (!item.selected) return;

      const err: string[] = [];

      if (!item.qtyToReturn || item.qtyToReturn <= 0)
        err.push("Quantity must be greater than 0.");

      if (item.returnReason === null) err.push("Return reason is required.");

      if (item.returnReason === ReturnReason.Other && !item.otherReason.trim())
        err.push("Please specify the reason for 'Other'.");

      if (!item.condition) err.push("Item condition is required.");

      if (!item.returnOption) err.push("Return option is required.");

      if (err.length) errors[item.id] = err;
    });

    setItemErrors(errors);

    if (Object.keys(errors).length > 0) {
      const first = Object.keys(errors)[0];
      const el = document.getElementById(`item-row-${first}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    return Object.keys(errors).length === 0;
  };

  // -----------------------------
  // PROCESS RETURN LOGIC
  // -----------------------------

  const handleProcessReturn = () => {
    if (!saleDetails) return;

    const hasSelected = items.some((i) => i.selected);
    if (!hasSelected) return;

    const valid = validateItems();
    if (!valid) return;

    setModalVisible(true);
  };

  const handleConfirmReturn = async () => {
    const payload = {
      saleId: saleDetails.id,
      items: items
        .filter((i) => i.selected && i.qtyToReturn > 0)
        .map((item) => ({
          saleItemId: item.id.toString(),
          quantityToReturn: item.qtyToReturn,
          reason: item.returnReason,
          reasonNote:
            item.returnReason === ReturnReason.Other
              ? item.otherReason
              : undefined,
          returnAmount: item.returnAmount,
          condition: item.condition,
          option: item.returnOption,
        })),
    };

    const response = await createReturn(payload);
    if (checkRequestSucceeded(response.statusCode)) {
      showSuccess(response.message);
      setSaleDetails(null);
      setSearchBy("");
      setSearchQuery("");
    }

    setModalVisible(false);

    setItems(
      items.map((item) => ({
        ...item,
        selected: false,
        qtyToReturn: 0,
        returnAmount: 0,
        returnReason: null,
        otherReason: "",
        condition: null,
        returnOption: null,
      }))
    );
  };

  // -----------------------------
  // FORMAT DATE & TIME
  // -----------------------------

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

  const totalReturnAmount = calculateTotalReturn();
  const selectedItemsCount = items.filter((i) => i.selected).length;

  console.log("selectedItemsCount", selectedItemsCount);

  return (
    <div className="return-page-container">
      {/* 🔥 NEW CLEAN HEADER COMPONENT */}
      <ReturnHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeSearchTab={activeSearchTab}
        setActiveSearchTab={setActiveSearchTab}
        onEnterPress={(v) => setSearchBy(v)}
        onBack={() => navigate("/")}
      />

      {/* Before Search */}
      {!hasSearched && !isLoadingSale && (
        <div className="no-transaction-box">
          <h3>Search for a transaction to begin</h3>
          <p>Enter a receipt number, phone, or customer name.</p>
        </div>
      )}

      {/* Not Found */}
      {transactionNotFound && !isLoadingSale && (
        <div className="no-transaction-box not-found">
          <h3>No transaction found</h3>
          <p>Please check the value you entered and try again.</p>
        </div>
      )}

      {/* Sale Found */}
      {saleDetails && (
        <section>
          <TransactionDetails
            saleId={saleDetails.id}
            receiptNumber={saleDetails.serialNumber}
            status="Completed"
            date={formattedDate}
            time={formattedTime}
            employee={saleDetails.staffName}
            customerName={saleDetails.customerName}
            customerPhone={saleDetails.customerPhone}
            totalAmount={saleDetails.total}
            paymentMethods={[
              { type: "Cash", amount: saleDetails.cashAmount },
              { type: "Card", amount: saleDetails.cardAmount },
            ]}
            onViewDetails={() => {}}
          />

          <SelectItemsToReturn
            items={items}
            itemErrors={itemErrors}
            onCheckboxChange={handleCheckboxChange}
            onQuantityChange={handleQuantityChange}
            onReturnReasonChange={handleReturnReasonChange}
            onOtherReasonChange={handleOtherReasonChange}
            onConditionChange={handleConditionChange}
            onReturnOptionChange={handleReturnOptionChange}
            totalReturnAmount={totalReturnAmount}
          />

          <div className="footer-buttons">
            <button
              className="process-btn"
              onClick={handleProcessReturn}
              disabled={!selectedItemsCount}
            >
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

      <LoadingScreen isLoading={isLoadingSale} />
    </div>
  );
};

export default ReturnPage;
