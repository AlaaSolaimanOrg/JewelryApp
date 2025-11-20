import React, { useState, type KeyboardEvent } from 'react';
import {
    FaArrowLeft,
    FaCalendarAlt,
    FaCheckCircle,
    FaClipboardCheck,
    FaClock,
    FaCog,
    FaCommentAlt,
    FaCreditCard,
    FaDollarSign,
    FaEye,
    FaFire,
    FaFrown,
    FaGem,
    FaMeh,
    FaMoneyBillWave,
    FaPhone,
    FaPrint,
    FaReceipt,
    FaRing,
    FaShoppingCart,
    FaSmile,
    FaTimesCircle,
    FaUndoAlt,
    FaUser,
    FaUserCircle,
    FaWarehouse
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ReturnPage.scss';
import CustomTable from '../../../components/Table/CustomTable';

interface TransactionItem {
    id: number;
    name: string;
    icon: 'ring' | 'gem';
    karat: string;
    weight: string;
    unitPrice: number;
    qtyPurchased: number;
    qtyToReturn: number;
    returnAmount: number;
    selected: boolean;
    returnReason: string; // Add this
    otherReason: string; // Add this
}

const ReturnPage: React.FC = () => {
    // Navigation
    const navigate = useNavigate();

    // State management
    const [searchQuery, setSearchQuery] = useState('');
    const [activeSearchTab, setActiveSearchTab] = useState<'receipt' | 'phone' | 'name'>('receipt');
    const [transactionVisible, setTransactionVisible] = useState(true);
    const [items, setItems] = useState<TransactionItem[]>([
        {
            id: 1,
            name: 'Diamond Solitaire Ring',
            icon: 'ring',
            karat: '21K',
            weight: '3.5g',
            unitPrice: 440.13,
            qtyPurchased: 1,
            qtyToReturn: 1,
            returnAmount: 440.13,
            selected: true,
            returnReason: '', // Add this
            otherReason: '' // Add this
        },
        {
            id: 2,
            name: 'Gold Tennis Bracelet',
            icon: 'gem',
            karat: '18K',
            weight: '8.2g',
            unitPrice: 920.68,
            qtyPurchased: 1,
            qtyToReturn: 0,
            returnAmount: 0,
            selected: false,
            returnReason: '', // Add this
            otherReason: '' // Add this
        }
    ]);


    const [selectedCondition, setSelectedCondition] = useState<'good' | 'needs_polishing' | 'damaged' | ''>('');
    const [selectedOption, setSelectedOption] = useState<'return_to_stock' | 'melt_after_return' | ''>('');
    const [modalVisible, setModalVisible] = useState(false);

    // Transaction data
    const transactionData = {
        receiptNumber: 'GC-2023-001245',
        status: 'Completed',
        date: 'October 15, 2023',
        time: '2:45 PM',
        employee: 'Sarah Johnson',
        customerName: 'John Doe',
        customerPhone: '(555) 123-4567',
        totalAmount: 2215.17,
        paymentMethods: [
            { type: 'Cash', amount: 1000.00 },
            { type: 'Card', amount: 1215.17 }
        ]
    };

    // Handlers
    const handleSearchKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            setTransactionVisible(true);
            // In real app, fetch transaction data here
        }
    };

    const handleCheckboxChange = (id: number) => {
        setItems(items.map(item => {
            if (item.id === id) {
                const selected = !item.selected;
                return {
                    ...item,
                    selected,
                    qtyToReturn: selected ? item.qtyPurchased : 0,
                    returnAmount: selected ? item.unitPrice * item.qtyPurchased : 0,
                    returnReason: selected ? item.returnReason : '', // Reset reason if deselected
                    otherReason: selected ? item.otherReason : '' // Reset other reason if deselected
                };
            }
            return item;
        }));
    };

    const handleReturnReasonChange = (id: number, value: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    returnReason: value,
                    otherReason: value === 'other' ? item.otherReason : '' // Clear other reason if not "other"
                };
            }
            return item;
        }));
    };

    const handleOtherReasonChange = (id: number, value: string) => {
        setItems(items.map(item => {
            if (item.id === id) {
                return {
                    ...item,
                    otherReason: value
                };
            }
            return item;
        }));
    };

    const handleQuantityChange = (id: number, value: string) => {
        const qty = Math.max(0, parseInt(value) || 0);
        setItems(items.map(item => {
            if (item.id === id) {
                const validQty = Math.min(qty, item.qtyPurchased);
                return {
                    ...item,
                    qtyToReturn: validQty,
                    returnAmount: item.unitPrice * validQty,
                    selected: validQty > 0
                };
            }
            return item;
        }));
    };

    const calculateTotalReturn = (): number => {
        return items.reduce((sum, item) => sum + item.returnAmount, 0);
    };

    const handleProcessReturn = () => {
        // Validation
        if (!transactionVisible) {
            alert('Please search for and select a transaction first.');
            return;
        }

        const hasSelectedItems = items.some(item => item.selected);
        if (!hasSelectedItems) {
            alert('Please select at least one item to return.');
            return;
        }



        if (!selectedCondition) {
            alert('Please select the item condition.');
            return;
        }

        if (!selectedOption) {
            alert('Please select a return option.');
            return;
        }

        // Check if all selected items have return reasons
        const selectedItems = items.filter(item => item.selected);
        const hasMissingReasons = selectedItems.some(item => !item.returnReason);

        if (hasMissingReasons) {
            alert('Please select a return reason for all selected items.');
            return;
        }

        // Check for "other" reasons without specification
        const hasMissingOtherReasons = selectedItems.some(item =>
            item.returnReason === 'other' && !item.otherReason.trim()
        );

        if (hasMissingOtherReasons) {
            alert('Please specify the return reason for items marked as "Other".');
            return;
        }

        setModalVisible(true);
    };

    const handleConfirmReturn = () => {
        alert('Return processed successfully! A return receipt has been generated.');
        setModalVisible(false);

        // Reset form
        setTransactionVisible(false);
        setItems(items.map(item => ({
            ...item,
            selected: false,
            qtyToReturn: 0,
            returnAmount: 0,
            returnReason: '',
            otherReason: ''
        })));
        setSelectedCondition('');
        setSelectedOption('');
    };

    const selectedItemsCount = items.filter(item => item.selected).length;
    const totalReturnAmount = calculateTotalReturn();


    // Update headers to include return reason
    const headers = [
        { key: 'Return', label: 'Return', width: '50px' },
        { key: 'Product', label: 'Product' },
        { key: 'Karat', label: 'Karat' },
        { key: 'Weight', label: 'Weight' },
        { key: 'UnitPrice', label: 'Unit Price' },
        { key: 'QtyPurchased', label: 'Qty Purchased' },
        { key: 'QtytoReturn', label: 'Qty to Return' },
        { key: 'ReturnReason', label: 'Return Reason' }, // Add this column
        { key: 'ReturnAmount', label: 'Return Amount' }
    ];

    // Update data to include return reason dropdown
    const data = items.map(item => ({
        Return: (
            <input
                type="checkbox"
                className="return-checkbox"
                checked={item.selected}
                onChange={() => handleCheckboxChange(item.id)}
            />
        ),
        Product: (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div className="product-icon">
                    {item.icon === 'ring' ? <FaRing /> : <FaGem />}
                </div>
                {item.name}
            </div>
        ),
        Karat: item.karat,
        Weight: item.weight,
        UnitPrice: `$${item.unitPrice.toFixed(2)}`,
        QtyPurchased: item.qtyPurchased,
        QtytoReturn: (
            <input
                type="number"
                className="return-qty-input"
                value={item.qtyToReturn}
                min="0"
                max={item.qtyPurchased}
                onChange={(e) => handleQuantityChange(item.id, e.target.value)}
            />
        ),
        ReturnReason: (
            <div>
                <select
                    className="form-select"
                    value={item.returnReason}
                    onChange={(e) => handleReturnReasonChange(item.id, e.target.value)}
                    disabled={!item.selected}
                    required
                >
                    <option value="">Select reason</option>
                    <option value="defective">Defective Product</option>
                    <option value="wrong_size">Wrong Size</option>
                    <option value="not_as_described">Not as Described</option>
                    <option value="changed_mind">Changed Mind</option>
                    <option value="gift_return">Gift Return</option>
                    <option value="other">Other</option>
                </select>
                {item.returnReason === 'other' && item.selected && (
                    <textarea
                        className="form-textarea"
                        placeholder="Provide details..."
                        value={item.otherReason}
                        onChange={(e) => handleOtherReasonChange(item.id, e.target.value)}
                        style={{ marginTop: '5px', width: '100%' }}
                    />
                )}
            </div>
        ),
        ReturnAmount: `$${item.returnAmount.toFixed(2)}`
    }));

    return (
        <div className="return-page-container" >
            {/* Header */}
            < header className="header" >
                <div className="logo">
                    <FaUndoAlt />
                    GoldCraft POS - Process Return
                </div>
                <div className="search-section">
                    <div className="search-tabs">
                        <div
                            className={`search-tab ${activeSearchTab === 'receipt' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('receipt')}
                        >
                            Receipt #
                        </div>
                        <div
                            className={`search-tab ${activeSearchTab === 'phone' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('phone')}
                        >
                            Phone
                        </div>
                        <div
                            className={`search-tab ${activeSearchTab === 'name' ? 'active' : ''}`}
                            onClick={() => setActiveSearchTab('name')}
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
                <button className="back-btn" onClick={() => navigate('/')}>
                    <FaArrowLeft /> Back to POS
                </button>
            </header >

            {/* Transaction Details Section */}
            < section className="section" >
                <h2 className="section-title">
                    <FaReceipt /> Transaction Details
                </h2>
                <div className={`transaction-card ${transactionVisible ? 'active' : ''}`}>
                    <div className="transaction-header">
                        <div className="transaction-id">
                            Receipt #: <span>{transactionData.receiptNumber}</span>
                        </div>
                        <div className="transaction-status">
                            <span className="status-badge status-completed">{transactionData.status}</span>
                        </div>
                    </div>
                    <div className="transaction-meta">
                        <div className="transaction-date">
                            <FaCalendarAlt />
                            <span>{transactionData.date}</span>
                        </div>
                        <div className="transaction-time">
                            <FaClock />
                            <span>{transactionData.time}</span>
                        </div>
                        <div className="transaction-employee">
                            <FaUser />
                            <span>{transactionData.employee}</span>
                        </div>
                    </div>
                    <div className="transaction-details">
                        <div className="transaction-detail">
                            <div className="detail-label">
                                <FaUserCircle />
                                Customer Name
                            </div>
                            <div className="detail-value">{transactionData.customerName}</div>
                        </div>
                        <div className="transaction-detail">
                            <div className="detail-label">
                                <FaPhone />
                                Customer Phone
                            </div>
                            <div className="detail-value">{transactionData.customerPhone}</div>
                        </div>
                        <div className="transaction-detail">
                            <div className="detail-label">
                                <FaDollarSign />
                                Total Amount
                            </div>
                            <div className="detail-value">${transactionData.totalAmount.toFixed(2)}</div>
                        </div>
                        <div className="transaction-detail">
                            <div className="detail-label">
                                <FaCreditCard />
                                Payment Method
                            </div>
                            <div className="detail-value">
                                {transactionData.paymentMethods.map((method, index) => (
                                    <span key={index} className="payment-method">
                                        {method.type === 'Cash' ? <FaMoneyBillWave /> : <FaCreditCard />}
                                        {method.type}: ${method.amount.toFixed(2)}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="transaction-actions">
                        <button className="action-btn print-receipt">
                            <FaPrint /> Print Receipt
                        </button>
                        <button className="action-btn view-details">
                            <FaEye /> View Details
                        </button>
                    </div>
                </div>
            </section >

            {/* Transaction Items Section */}
            < section className="section" >
                <h2 className="section-title">
                    <FaShoppingCart /> Select Items to Return
                </h2>
                <CustomTable
                    headers={headers}
                    data={data}
                />
                <div style={{ textAlign: 'right', marginTop: '15px', fontWeight: 600 }}>
                    Total Return Amount: <span id="totalReturnAmount">${totalReturnAmount.toFixed(2)}</span>
                </div>
            </section >





            {/* Condition Check Section */}
            <section className="section">
                <h2 className="section-title">
                    <FaClipboardCheck /> Condition Check
                </h2>
                <div className="form-group">
                    <label>Item Condition</label>
                    <div className="condition-options">
                        <div
                            className={`condition-option ${selectedCondition === 'good' ? 'selected' : ''}`}
                            onClick={() => setSelectedCondition('good')}
                        >
                            <FaSmile />
                            <div>Good</div>
                        </div>
                        <div
                            className={`condition-option ${selectedCondition === 'needs_polishing' ? 'selected' : ''}`}
                            onClick={() => setSelectedCondition('needs_polishing')}
                        >
                            <FaMeh />
                            <div>Needs Polishing</div>
                        </div>
                        <div
                            className={`condition-option ${selectedCondition === 'damaged' ? 'selected' : ''}`}
                            onClick={() => setSelectedCondition('damaged')}
                        >
                            <FaFrown />
                            <div>Damaged</div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="purchaseDate">Date of Purchase</label>
                    <input
                        type="date"
                        className="form-input"
                        id="purchaseDate"
                        value={new Date().toISOString().split('T')[0]}
                        readOnly
                    />
                </div>
            </section>

            {/* Return Options Section */}
            <section className="section">
                <h2 className="section-title">
                    <FaCog /> Return Options
                </h2>
                <div className="return-options">
                    <div
                        className={`return-option ${selectedOption === 'return_to_stock' ? 'selected' : ''}`}
                        onClick={() => setSelectedOption('return_to_stock')}
                    >
                        <FaWarehouse />
                        <h3>Return to Stock</h3>
                        <p>Item will be added back to inventory and available for sale</p>
                    </div>
                    <div
                        className={`return-option ${selectedOption === 'melt_after_return' ? 'selected' : ''}`}
                        onClick={() => setSelectedOption('melt_after_return')}
                    >
                        <FaFire />
                        <h3>Melt After Return</h3>
                        <p>Item will be melted down and raw materials added to inventory</p>
                    </div>
                </div>
            </section >

            {/* Footer Buttons */}
            < div className="footer-buttons" >
                <button className="process-btn" onClick={handleProcessReturn}>
                    <FaCheckCircle /> Process Return
                </button>
                <button className="cancel-btn" onClick={() => navigate('/')}>
                    <FaTimesCircle /> Cancel
                </button>
            </div >

            {/* Confirmation Modal */}
            < div className={`modal-overlay ${modalVisible ? 'active' : ''}`}>
                <div className="modal">
                    <div className="modal-header">
                        <h3 className="modal-title">Confirm Return</h3>
                        <button className="close-modal" onClick={() => setModalVisible(false)}>&times;</button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to process this return?</p>
                        <div className="return-summary">
                            <div className="summary-row">
                                <span>Items Returning:</span>
                                <span>{selectedItemsCount}</span>
                            </div>
                            <div className="summary-row">
                                <span>Return Amount:</span>
                                <span>${totalReturnAmount.toFixed(2)}</span>
                            </div>
                            <div className="summary-row">
                                <span>Refund Method:</span>
                                <span>Original Payment</span>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button className="modal-cancel-btn" onClick={() => setModalVisible(false)}>Cancel</button>
                        <button className="modal-confirm-btn" onClick={handleConfirmReturn}>
                            Confirm Return
                        </button>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default ReturnPage;
