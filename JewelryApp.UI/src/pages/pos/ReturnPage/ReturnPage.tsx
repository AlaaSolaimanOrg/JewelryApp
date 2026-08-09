import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaUndoAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import LoadingScreen from "../../../components/loaders/LoadingScreen/LoadingScreen";
import { createReturn } from "../../../apis/returns.api/returns.api";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";

import {
  ReturnReason,
  type ItemCondition,
  type ReturnOption,
} from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";

import RefundModal from "./RefundModal/RefundModal";
import RefundSummaryPanel from "./RefundSummaryPanel/RefundSummaryPanel";
import ReturnItemCard from "./ReturnItemCard/ReturnItemCard";
import SearchScreen from "./SearchScreen/SearchScreen";
import TransactionPanel from "./TransactionPanel/TransactionPanel";
import type {
  RefundMethod,
  Sale,
  SearchSale,
  SearchTab,
  TransactionItem,
} from "./ReturnPage.type";
import { mapSaleItemsToTransactionItems } from "./ReturnPage.utils";
import "./ReturnPage.scss";

const SEARCH_TABS: { value: SearchTab; label: string }[] = [
  { value: "name", label: "Name" },
  { value: "phone", label: "Phone" },
  { value: "receipt", label: "Receipt #" },
];

const ReturnPage: React.FC = () => {
  const navigate = useNavigate();

  const [activeSearchTab, setActiveSearchTab] = useState<SearchTab>("name");
  const [selectedSale, setSelectedSale] = useState<SearchSale | null>(null);
  const [items, setItems] = useState<TransactionItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const {
    data: saleDetails,
    setData: setSaleDetails,
    isLoading: isLoadingSale,
  } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { saleId: selectedSale?.id || "" },
    extraEffectCheck: !!selectedSale,
    effectDependency: [selectedSale],
    dataInitalValue: null,
  }) as {
    data: Sale | null;
    setData: React.Dispatch<React.SetStateAction<Sale | null>>;
    isLoading: boolean;
  };

  useEffect(() => {
    if (!saleDetails) return;
    setItems(mapSaleItemsToTransactionItems(saleDetails.saleItems));
  }, [saleDetails]);

  const handleBackToSearch = () => {
    setSelectedSale(null);
    setSaleDetails(null);
    setItems([]);
  };

  const handleToggle = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              selected: !item.selected,
              qtyToReturn: !item.selected ? item.qtyPurchased : 0,
              returnAmount: !item.selected ? item.qtyPurchased * item.unitPrice : 0,
            }
          : item,
      ),
    );
  };

  const handleQuantityChange = (id: string, value: string) => {
    if (value === "") {
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qtyToReturn: 0, returnAmount: 0 } : item)),
      );
      return;
    }

    const qty = Math.max(0, parseInt(value) || 0);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const validQty = Math.min(qty, item.qtyPurchased);
        return { ...item, qtyToReturn: validQty, returnAmount: validQty * item.unitPrice };
      }),
    );
  };

  const handleQuantityBlur = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id || item.qtyToReturn > 0) return item;
        const validQty = Math.min(1, item.qtyPurchased);
        return { ...item, qtyToReturn: validQty, returnAmount: validQty * item.unitPrice };
      }),
    );
  };

  const handleAmountChange = (id: string, value: string) => {
    const amount = Math.max(0, parseFloat(value) || 0);
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const maxAmount = item.qtyToReturn * item.unitPrice;
        return { ...item, returnAmount: Math.min(amount, maxAmount) };
      }),
    );
  };

  const handleReasonChange = (id: string, value: ReturnReason | null) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              returnReason: value,
              otherReason: value === ReturnReason.Other ? item.otherReason : "",
            }
          : item,
      ),
    );
  };

  const handleOtherReasonChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, otherReason: value } : item)),
    );
  };

  const handleConditionChange = (id: string, value: ItemCondition) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, condition: value } : item)),
    );
  };

  const handleDestinationChange = (id: string, value: ReturnOption) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, returnOption: value } : item)),
    );
  };

  const handleConfirmReturn = async (refundMethod: RefundMethod) => {
    if (!saleDetails) return;

    const payload = {
      saleId: saleDetails.id,
      refundMethod: refundMethod === "Cash" ? 1 : 2,
      items: items
        .filter((i) => i.selected && i.qtyToReturn > 0)
        .map((item) => ({
          saleItemId: item.id,
          quantityToReturn: item.qtyToReturn,
          reason: item.returnReason,
          reasonNote:
            item.returnReason === ReturnReason.Other ? item.otherReason : undefined,
          returnAmount: item.returnAmount,
          condition: item.condition,
          option: item.returnOption,
        })),
    };

    const response = await createReturn(payload);
    if (checkRequestSucceeded(response.statusCode)) {
      showSuccess(response.message);
      setModalVisible(false);
      setSaleDetails(null);
      setSelectedSale(null);
      setItems([]);
    } else {
      showError(response?.message);
      setModalVisible(false);
    }
  };

  const refundTotal = items
    .filter((i) => i.selected && i.qtyToReturn > 0)
    .reduce((sum, i) => sum + i.returnAmount, 0);

  return (
    <div className="return-page">
      <div className="rp-top-bar">
        <span className="rp-top-title">
          <FaUndoAlt /> Process return
        </span>
        <div className="rp-top-right">
          {!selectedSale ? (
            <>
              <div className="rp-pill-tabs">
                {SEARCH_TABS.map((tab) => (
                  <div
                    key={tab.value}
                    className={`rp-pill-btn ${activeSearchTab === tab.value ? "active" : ""}`}
                    onClick={() => setActiveSearchTab(tab.value)}
                  >
                    {tab.label}
                  </div>
                ))}
              </div>
              <button className="rp-btn rp-btn-outline" onClick={() => navigate("/")}>
                <FaArrowLeft /> Back to POS
              </button>
            </>
          ) : (
            <button className="rp-btn rp-btn-outline" onClick={handleBackToSearch}>
              <FaArrowLeft /> Back to search
            </button>
          )}
        </div>
      </div>

      {!selectedSale && (
        <SearchScreen activeTab={activeSearchTab} onSelectSale={setSelectedSale} />
      )}

      {selectedSale && saleDetails && (
        <div className="rp-return-main">
          <div className="rp-return-left">
            <div className="rp-return-left-box">
              <div className="rp-return-left-head">
                <span className="rp-return-left-title">Select items to return</span>
                <span className="rp-return-item-count">{items.length} items</span>
              </div>
              <div className="rp-return-items">
                {items.map((item) => (
                  <ReturnItemCard
                    key={item.id}
                    item={item}
                    onToggle={handleToggle}
                    onQuantityChange={handleQuantityChange}
                    onQuantityBlur={handleQuantityBlur}
                    onAmountChange={handleAmountChange}
                    onReasonChange={handleReasonChange}
                    onOtherReasonChange={handleOtherReasonChange}
                    onConditionChange={handleConditionChange}
                    onDestinationChange={handleDestinationChange}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="rp-return-right">
            <TransactionPanel sale={saleDetails} />
            <RefundSummaryPanel items={items} onSubmit={() => setModalVisible(true)} />
          </div>
        </div>
      )}

      <RefundModal
        show={modalVisible}
        total={refundTotal}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirmReturn}
      />

      <LoadingScreen isLoading={isLoadingSale} />
    </div>
  );
};

export default ReturnPage;
