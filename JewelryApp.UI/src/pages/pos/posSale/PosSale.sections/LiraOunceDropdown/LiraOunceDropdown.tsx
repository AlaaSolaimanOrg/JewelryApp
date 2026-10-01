import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FaChevronLeft } from "react-icons/fa";
import { GiGoldBar } from "react-icons/gi";
import { getBullionProducts } from "../../../../../apis/products.api";
import { showError } from "../../../../../utils";
import type {
  BullionCategory,
  BullionProducts,
  LiraOunceDropdownProps,
} from "./LiraOunceDropdown.type";
import "./liraOunceDropdown.scss";

const LiraOunceDropdown: React.FC<LiraOunceDropdownProps> = ({
  selectedIds,
  onProductSelected,
}) => {
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<BullionCategory | null>(null);
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

  const handleToggle = (nextShow: boolean) => {
    setOpen(nextShow);
    if (nextShow) {
      setCategory(null);
      loadProducts();
    }
  };

  const handleSelectProduct = (product: BullionProducts["liras"][number]) => {
    onProductSelected(product);
    setOpen(false);
  };

  const items = category ? bullion[category] : [];

  return (
    <Dropdown
      className="lira-ounce-dropdown"
      show={open}
      onToggle={handleToggle}
    >
      <Dropdown.Toggle as="button" className="ps-btn ps-btn-gold">
        <GiGoldBar /> Bullions
      </Dropdown.Toggle>

      <Dropdown.Menu className="lo-menu">
        {!category && (
          <>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => setCategory("liras")}
            >
              Liras
            </button>
            <button
              type="button"
              className="dropdown-item"
              onClick={() => setCategory("ounces")}
            >
              Ounces
            </button>
          </>
        )}

        {category && (
          <>
            <button
              type="button"
              className="dropdown-item lo-back"
              onClick={() => setCategory(null)}
            >
              <FaChevronLeft /> Back
            </button>
            <Dropdown.Divider />

            {items.length === 0 && (
              <div className="lo-empty">
                {isLoading ? "Loading..." : "No items in stock"}
              </div>
            )}
            {items.map((product) => (
              <button
                key={product.id}
                type="button"
                className={`dropdown-item${
                  selectedIds.includes(product.id) ? " active" : ""
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                {product.name || product.sku}
              </button>
            ))}
          </>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LiraOunceDropdown;
