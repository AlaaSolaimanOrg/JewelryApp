import React, { useState } from "react";
import { FaUndo, FaFire } from "react-icons/fa";
import "./returnManagement.scss";

import useLocalApiSearchSortPagination from "../../../hooks/useLocalApiSearchSortPagination";
import {
    ItemCondition,
    KaratType,
    ReturnOption,
    ReturnReason,
} from "../../../types/enums";

import { getReturns } from "../../../apis/returns.api/returns.api";
import Paginator from "../../../components/Paginator/Paginator";
import CustomLoader from "../../../components/CustomLoader/CustomLoader";

export interface ReturnItem {
    id: string;
    saleItemId: string;
    productName: string;
    sku: string;
    karat: KaratType;
    weight: number;
    quantityReturned: number;
    amountReturned: number;
    reason: ReturnReason;
    reasonNote: string;
    condition: ItemCondition;
    option: ReturnOption;
    productImage: string;
}

export interface Return {
    id: string;
    saleId: string;
    saleSerialNumber: string;
    customerName: string;
    customerPhone: string;
    returnDate: string;
    totalAmountReturned: number;
    items: ReturnItem[];
}

const ReturnManagement: React.FC = () => {
    const [optionFilter, setOptionFilter] = useState<string>("");
    const [expandedReturnId, setExpandedReturnId] = useState<string | null>(null);

    const {
        data: returns,
        isLoading,
        fetchData: recallGetReturns,
        onSearchChange,
        pagination,
        onPaginationChange,
    } = useLocalApiSearchSortPagination<Return>({
        apiToCall: (data) => getReturns(data.payload),
        extraPayload: { returnOption: optionFilter },
        extraEffectDependency: [optionFilter],
        initialPageSize: 10,
    });

    const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const toggleReturnExpansion = (returnId: string) => {
        setExpandedReturnId(expandedReturnId === returnId ? null : returnId);
    };

    const getCustomerInitials = (name: string) => {
        return name
            .split(" ")
            ?.map((word) => word[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getReturnReasonLabel = (reason: ReturnReason) => {
        const labels: Record<ReturnReason, string> = {
            [ReturnReason.NotAsExpected]: "Not As Expected",
            [ReturnReason.WrongSize]: "Wrong Size",
            [ReturnReason.Defective]: "Defective",
            [ReturnReason.GiftReturn]: "Gift Return",
            [ReturnReason.Other]: "Other",
        };
        return labels[reason] || "Unknown";
    };

    const getConditionLabel = (condition: ItemCondition) => {
        const labels: Record<ItemCondition, string> = {
            [ItemCondition.Good]: "Good",
            [ItemCondition.NeedsPolishing]: "Needs Polishing",
            [ItemCondition.Damaged]: "Damaged",
        };
        return labels[condition] || "Unknown";
    };

    // Separate returns by option
    const returnedToStock = returns?.filter((ret) =>
        ret.items.some((item) => item.option === ReturnOption.ReturnToStock)
    );

    const toMelt = returns?.filter((ret) =>
        ret.items.some((item) => item.option === ReturnOption.MeltAfterReturn)
    );

    const renderReturnCard = (returnData: Return) => {
        const isExpanded = expandedReturnId === returnData.id;

        return (
            <div
                key={returnData.id}
                className={`return-card ${isExpanded ? "expanded" : ""}`}
            >
                {/* CARD HEADER */}
                <div
                    className="return-card__header"
                    onClick={() => toggleReturnExpansion(returnData.id)}
                >
                    <div className="return-card__customer">
                        <div className="customer-avatar">
                            {getCustomerInitials(returnData.customerName)}
                        </div>
                        <div className="customer-info">
                            <h3 className="customer-name">{returnData.customerName}</h3>
                            <div className="customer-meta">
                                <span className="meta-item">
                                    Phone: {returnData.customerPhone}
                                </span>
                                <span className="meta-item">
                                    Date: {formatDate(returnData.returnDate)}
                                </span>
                                <span className="meta-item">
                                    Amount: {formatCurrency(returnData.totalAmountReturned)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="return-card__actions">
                        <div className="return-id">Receipt: {returnData.saleSerialNumber}</div>
                        <span className="items-count">{returnData.items?.length} items</span>
                        <button className="expand-toggle">
                            {isExpanded ? "▲" : "▼"}
                        </button>
                    </div>
                </div>

                {/* EXPANDED CONTENT */}
                {isExpanded && (
                    <div className="return-card__content">
                        <div className="return-details">
                            <div className="detail-section">
                                <h4 className="section-subtitle">
                                    Returned Items ({returnData.items?.length})
                                </h4>

                                <div className="items-table-container">
                                    <table className="items-table">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Product</th>
                                                <th>SKU</th>
                                                <th>Karat</th>
                                                <th>Weight</th>
                                                <th>Qty</th>
                                                <th>Amount</th>
                                                <th>Reason</th>
                                                <th>Condition</th>
                                                <th>Option</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {returnData.items?.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td>{index + 1}</td>
                                                    <td>
                                                        <div className="product-cell">
                                                            {item.productImage && (
                                                                <img
                                                                    src={item.productImage}
                                                                    alt={item.productName}
                                                                    className="product-image"
                                                                />
                                                            )}
                                                            <span>{item.productName}</span>
                                                        </div>
                                                    </td>
                                                    <td>{item.sku}</td>
                                                    <td>
                                                        <span className="badge-karat">{item.karat}K</span>
                                                    </td>
                                                    <td>{item.weight}g</td>
                                                    <td>{item.quantityReturned}</td>
                                                    <td>{formatCurrency(item.amountReturned)}</td>
                                                    <td>
                                                        <span className="badge-reason">
                                                            {getReturnReasonLabel(item.reason)}
                                                        </span>
                                                        {item.reasonNote && (
                                                            <div className="reason-note">{item.reasonNote}</div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge-condition ${ItemCondition[item.condition]
                                                                }`}
                                                        >
                                                            {getConditionLabel(item.condition)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span
                                                            className={`badge-option ${ReturnOption[item.option]
                                                                }`}
                                                        >
                                                            {item.option === ReturnOption.ReturnToStock
                                                                ? "Return to Stock"
                                                                : "Melt"}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>

                                        <tfoot>
                                            <tr>
                                                <td colSpan={6} className="total-label">
                                                    Total Returned:
                                                </td>
                                                <td className="total-cost" colSpan={4}>
                                                    {formatCurrency(returnData.totalAmountReturned)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div id="return-management" className="page">
            <div className="page-header">
                <h1 className="page-title">
                    <FaUndo className="icon" />
                    <span>Return Management</span>
                </h1>
            </div>

            {/* HEADER WITH FILTERS */}
            <header className="headerFilter">
                <div className="filters-container">
                    <div className="search-filter-row">
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search by customer name, phone, or receipt..."
                            onChange={onSearchChange}
                        />

                        <select
                            className="filter-select"
                            value={optionFilter}
                            onChange={(e) => setOptionFilter(e.target.value)}
                        >
                            <option value="">All Returns</option>
                            <option value={ReturnOption.ReturnToStock}>
                                Returned to Stock
                            </option>
                            <option value={ReturnOption.MeltAfterReturn}>
                                To Melt
                            </option>
                        </select>
                    </div>
                </div>
            </header>

            {/* RETURNED TO STOCK SECTION */}
            <section className="section">
                <h2 className="section-title">
                    <FaUndo className="icon" />
                    Returned to Stock
                </h2>
                <span className="return-count">
                    {returnedToStock?.length} {returnedToStock?.length === 1 ? 'return' : 'returns'}
                </span>

                <div className="returns-container">
                    {isLoading ? (
                        <div className="returns-loader">
                            <CustomLoader />
                        </div>
                    ) : returnedToStock?.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📦</div>
                            <h3>No Returns to Stock</h3>
                            <p>No items have been returned to stock yet</p>
                        </div>
                    ) : (
                        returnedToStock?.map(renderReturnCard)
                    )}
                </div>
            </section>

            {/* MELTED ITEMS SECTION */}
            <section className="section">
                <h2 className="section-title">
                    <FaFire className="icon" />
                    Items to Melt
                </h2>
                <span className="return-count melt">
                    {toMelt?.length} {toMelt?.length === 1 ? 'return' : 'returns'}
                </span>

                <div className="returns-container">
                    {isLoading ? (
                        <div className="returns-loader">
                            <CustomLoader />
                        </div>
                    ) : toMelt?.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">🔥</div>
                            <h3>No Items to Melt</h3>
                            <p>No items have been marked for melting yet</p>
                        </div>
                    ) : (
                        toMelt?.map(renderReturnCard)
                    )}
                </div>
            </section>

            {/* PAGINATION */}
            <Paginator
                totalRecords={pagination.totalRecords}
                pageNumber={pagination.pageNumber}
                pageSize={pagination.pageSize}
                onPaginationChange={onPaginationChange}
            />
        </div>
    );
};

export default ReturnManagement;
