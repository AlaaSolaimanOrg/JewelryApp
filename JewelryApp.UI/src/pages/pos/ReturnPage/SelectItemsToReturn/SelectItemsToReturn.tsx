import React from 'react';
import { FaFire, FaFrown, FaGem, FaMeh, FaRing, FaShoppingCart, FaSmile, FaWarehouse } from 'react-icons/fa';
import './selectItemsToReturn.scss';
import CustomTable from '../../../../components/Table/CustomTable';

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
    returnReason: string;
    otherReason: string;
    condition: 'good' | 'needs_polishing' | 'damaged' | '';
    returnOption: 'return_to_stock' | 'melt_after_return' | '';
}

interface SelectItemsToReturnProps {
    items: TransactionItem[];
    onCheckboxChange: (id: number) => void;
    onQuantityChange: (id: number, value: string) => void;
    onReturnReasonChange: (id: number, value: string) => void;
    onOtherReasonChange: (id: number, value: string) => void;
    onConditionChange: (id: number, condition: 'good' | 'needs_polishing' | 'damaged') => void;
    onReturnOptionChange: (id: number, option: 'return_to_stock' | 'melt_after_return') => void;
    totalReturnAmount: number;
}

const SelectItemsToReturn: React.FC<SelectItemsToReturnProps> = ({
    items,
    onCheckboxChange,
    onQuantityChange,
    onReturnReasonChange,
    onOtherReasonChange,
    onConditionChange,
    onReturnOptionChange,
    totalReturnAmount
}) => {
    const headers = [
        { key: 'Return', label: 'Return', width: '50px' },
        { key: 'Product', label: 'Product' },
        { key: 'Karat', label: 'Karat' },
        { key: 'Weight', label: 'Weight' },
        { key: 'UnitPrice', label: 'Unit Price' },
        { key: 'QtyPurchased', label: 'Qty Purchased' },
        { key: 'QtytoReturn', label: 'Qty to Return' },
        { key: 'ReturnReason', label: 'Return Reason' },
        { key: 'Condition', label: 'Condition' },
        { key: 'ReturnOption', label: 'Return Option' },
        { key: 'ReturnAmount', label: 'Return Amount' }
    ];

    const data = items.map(item => ({
        Return: (
            <input
                type="checkbox"
                className="return-checkbox"
                checked={item.selected}
                onChange={() => onCheckboxChange(item.id)}
            />
        ),
        Product: (
            <div className="product-cell">
                <div className="product-icon">
                    {item.icon === 'ring' ? <FaRing /> : <FaGem />}
                </div>
                <span className="product-name">{item.name}</span>
            </div>
        ),
        Karat: <span className="karat-value">{item.karat}</span>,
        Weight: <span className="weight-value">{item.weight}</span>,
        UnitPrice: <span className="unit-price">${item.unitPrice.toFixed(2)}</span>,
        QtyPurchased: <span className="qty-purchased">{item.qtyPurchased}</span>,
        QtytoReturn: (
            <input
                type="number"
                className="return-qty-input"
                value={item.qtyToReturn}
                min="0"
                max={item.qtyPurchased}
                onChange={(e) => onQuantityChange(item.id, e.target.value)}
                disabled={!item.selected}
            />
        ),
        ReturnReason: (
            <div className="return-reason-cell">
                <select
                    className="form-select"
                    value={item.returnReason}
                    onChange={(e) => onReturnReasonChange(item.id, e.target.value)}
                    disabled={!item.selected}
                    required
                    style={{ marginBottom: item.returnReason === 'other' && item.selected ? '8px' : '0' }}
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
                        placeholder="Please specify the reason..."
                        value={item.otherReason}
                        onChange={(e) => onOtherReasonChange(item.id, e.target.value)}
                    />
                )}
            </div>
        ),
        Condition: (
            <div className="condition-options-vertical">
                <div
                    className={`condition-option-small ${item.condition === 'good' ? 'selected' : ''} ${!item.selected ? 'disabled' : ''}`}
                    onClick={() => item.selected && onConditionChange(item.id, 'good')}
                >
                    <FaSmile style={{
                        color: item.condition === 'good' ? '#1ea97c' : '#666'
                    }} />
                    <div>Good</div>
                </div>
                <div
                    className={`condition-option-small ${item.condition === 'needs_polishing' ? 'selected' : ''} ${!item.selected ? 'disabled' : ''}`}
                    onClick={() => item.selected && onConditionChange(item.id, 'needs_polishing')}
                >
                    <FaMeh style={{
                        color: item.condition === 'needs_polishing' ? '#ffb300' : '#666'
                    }} />
                    <div>Needs Polish</div>
                </div>
                <div
                    className={`condition-option-small ${item.condition === 'damaged' ? 'selected' : ''} ${!item.selected ? 'disabled' : ''}`}
                    onClick={() => item.selected && onConditionChange(item.id, 'damaged')}
                >
                    <FaFrown style={{
                        color: item.condition === 'damaged' ? '#ff6b6b' : '#666'
                    }} />
                    <div>Damaged</div>
                </div>
            </div>
        ),
        ReturnOption: (
            <div className="return-options-vertical">
                <div
                    className={`return-option-small ${item.returnOption === 'return_to_stock' ? 'selected' : ''} ${!item.selected ? 'disabled' : ''}`}
                    onClick={() => item.selected && onReturnOptionChange(item.id, 'return_to_stock')}
                >
                    <FaWarehouse style={{
                        color: item.returnOption === 'return_to_stock' ? '#1a3a5f' : '#666'
                    }} />
                    <div>Return to Stock</div>
                    <span className="option-description">Available for sale</span>
                </div>
                <div
                    className={`return-option-small ${item.returnOption === 'melt_after_return' ? 'selected' : ''} ${!item.selected ? 'disabled' : ''}`}
                    onClick={() => item.selected && onReturnOptionChange(item.id, 'melt_after_return')}
                >
                    <FaFire style={{
                        color: item.returnOption === 'melt_after_return' ? '#ff6b6b' : '#666'
                    }} />
                    <div>Melt</div>
                    <span className="option-description">Melt for materials</span>
                </div>
            </div>
        ),
        ReturnAmount: <span className={`return-amount ${item.returnAmount > 0 ? 'has-amount' : ''}`}>
            ${item.returnAmount.toFixed(2)}
        </span>
    }));

    return (
        <section className="select-items-section">
            <h2 className="section-title">
                <FaShoppingCart /> Select Items to Return
            </h2>
            <CustomTable
                headers={headers}
                data={data}
            />
            <div className="total-return-amount">
                Total Return Amount: <span id="totalReturnAmount">${totalReturnAmount.toFixed(2)}</span>
            </div>
        </section>
    );
};

export default SelectItemsToReturn;