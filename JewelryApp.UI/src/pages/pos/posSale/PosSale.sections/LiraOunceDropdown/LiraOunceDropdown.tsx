import { useRef, useState } from "react";
import {
  FaBoxOpen,
  FaChevronDown,
  FaChevronUp,
  FaCoins,
} from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { getBullionProducts } from "../../../../../apis/products.api";
import { showError } from "../../../../../utils";
import type {
  BullionGroupProps,
  BullionProducts,
  LiraOunceDropdownProps,
} from "./LiraOunceDropdown.type";
import "./liraOunceDropdown.scss";

const BullionGroup: React.FC<BullionGroupProps> = ({
  title,
  subtitle,
  icon,
  items,
  isLoading,
  selectedIds,
  onSelect,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="lo-group">
      <div className="lo-group-head" onClick={() => setCollapsed((c) => !c)}>
        <div className="lo-group-icon">{icon}</div>
        <div className="lo-group-text">
          <div className="lo-group-title">{title}</div>
          <div className="lo-group-sub">{subtitle}</div>
        </div>
        <span className="lo-group-count">
          {items.length} item{items.length !== 1 ? "s" : ""}
        </span>
        {collapsed ? <FaChevronDown /> : <FaChevronUp />}
      </div>

      {!collapsed && (
        <div className="lo-grid">
          {items.length === 0 && (
            <div className="lo-empty">
              {isLoading ? "Loading..." : "No items in stock"}
            </div>
          )}
          {items.map((product) => {
            const image = product.images?.[0]?.imageUrl;
            return (
              <button
                key={product.id}
                type="button"
                className={`lo-card${
                  selectedIds.includes(product.id) ? " selected" : ""
                }`}
                onClick={() => onSelect(product)}
              >
                <div className="lo-card-img">
                  {image ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}${image}`}
                      alt={product.name}
                    />
                  ) : (
                    <GiGoldBar />
                  )}
                </div>
                <div className="lo-card-name">{product.name || product.sku}</div>
                <div className="lo-card-stock">
                  <FaBoxOpen /> In stock: {product.quantity}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

const LiraOunceDropdown: React.FC<LiraOunceDropdownProps> = ({
  selectedIds,
  onProductSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [panelTop, setPanelTop] = useState(64);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bullion, setBullion] = useState<BullionProducts>({
    liras: [],
    ounces: [],
  });

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getBullionProducts();
      setBullion({
        liras: response?.data?.liras ?? [],
        ounces: response?.data?.ounces ?? [],
      });
    } catch (e) {
      console.error(e);
      showError("Failed to load liras and ounces");
    } finally {
      setIsLoading(false);
    }
  };

  const toggle = () => {
    if (!open) {
      const rect = toggleRef.current?.getBoundingClientRect();
      setPanelTop((rect?.bottom ?? 64) + 8);
      loadProducts();
    }
    setOpen(!open);
  };

  const handleSelect = (product: BullionGroupProps["items"][number]) => {
    onProductSelected(product);
    setOpen(false);
  };

  return (
    <div className="lira-ounce-dropdown">
      <button
        ref={toggleRef}
        type="button"
        className="ps-btn ps-btn-gold lo-toggle"
        onClick={toggle}
      >
        <GiGoldBar size={20} /> Bullions {open ? <FaChevronUp /> : <FaChevronDown />}
      </button>

      {open && (
        <>
          <div className="lo-backdrop" onClick={() => setOpen(false)} />
          <div className="lo-panel" style={{ top: panelTop }}>
            <BullionGroup
              title="Liras"
              subtitle="Gold coins in Lebanese Lira"
              icon={<FaCoins />}
              items={bullion.liras}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onSelect={handleSelect}
            />
            <BullionGroup
              title="Ounces"
              subtitle="Gold bars in ounces"
              icon={<GiGoldBar />}
              items={bullion.ounces}
              isLoading={isLoading}
              selectedIds={selectedIds}
              onSelect={handleSelect}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default LiraOunceDropdown;
