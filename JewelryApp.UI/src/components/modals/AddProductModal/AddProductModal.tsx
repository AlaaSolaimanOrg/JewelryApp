import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import { getPricingSettings } from "../../../apis/pricingSettings.api";
import { KaratType, ProductCategory, ProductType } from "../../../types/enums";
import preventSignOnKeyDown, {
  checkRequestSucceeded,
  isPositiveInteger,
  showError,
} from "../../../utils";
import "./addProductModal.scss";

const categoriesRequiringSize = [
  ProductCategory.Necklaces,
  ProductCategory.Bracelets,
  ProductCategory.Rings,
  ProductCategory.Bangles,
];

const initialFields = {
  productName: "",
  karat: String(KaratType.Karat18),
  productType: String(ProductType.Gold),
  weight: "",
  category: "",
  specification: "",
  quantity: 1,
};

interface PricingSettingItem {
  karatType: KaratType;
  productType: ProductType;
  pricePerGram: number;
}

interface AddProductModalProps {
  show: boolean;
  onClose: () => void;
  onProductAdded: (product: any) => void;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  show,
  onClose,
  onProductAdded,
}) => {
  const [fields, setFields] = useState(initialFields);
  const [isLoading, setIsLoading] = useState(false);
  const [pricingSettings, setPricingSettings] = useState<
    PricingSettingItem[] | null
  >(null);

  useEffect(() => {
    if (!show) return;
    setFields(initialFields);
    setPricingSettings(null);
    setIsLoading(true);
    getPricingSettings()
      .then((res) => {
        if (checkRequestSucceeded(res?.statusCode)) {
          setPricingSettings(res?.data ?? []);
        } else {
          showError(res?.message);
        }
      })
      .finally(() => setIsLoading(false));
  }, [show]);

  const handleField = (name: string, value: any) => {
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const requiresSize = categoriesRequiringSize.includes(
    Number(fields.category) as ProductCategory,
  );

  const isInvalid =
    !fields.productName ||
    !fields.category ||
    !fields.karat ||
    !fields.productType ||
    Number(fields.weight) <= 0 ||
    !fields.weight ||
    Number(fields.quantity) <= 0;

  const handleConfirm = () => {
    if (isInvalid || isLoading || !pricingSettings) return;

    const setting = pricingSettings.find(
      (item) =>
        Number(item.karatType) === Number(fields.karat) &&
        Number(item.productType) === Number(fields.productType),
    );
    const pricePerGram = setting?.pricePerGram ?? 0;

    onProductAdded({
      id: null,
      sku: null,
      name: fields.productName,
      quantity: Number(fields.quantity),
      quantityForSale: 1,
      karatType: Number(fields.karat),
      weight: fields.weight,
      category: Number(fields.category),
      productType: Number(fields.productType),
      specification: fields.specification,
      description: "",
      pricePerGram,
      originalPricePerGram: pricePerGram,
      images: [],
      manual: false,
      pending: true,
    });
    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="add-product-modal"
      container={() =>
        (document.querySelector(".pos-app") ||
          document.querySelector(".jewleryApp") ||
          document.body) as HTMLElement
      }
    >
      <Modal.Header closeButton>
        <Modal.Title>Add Product to Cart</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="add-product-modal-form">
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  maxLength={100}
                  className="form-control"
                  placeholder="Enter product name"
                  value={fields.productName}
                  onChange={(e) => handleField("productName", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Quantity</label>
                <input
                  type="number"
                  onWheel={(e) => e.currentTarget.blur()}
                  min={1}
                  step={1}
                  className="form-control"
                  placeholder="Enter quantity"
                  onKeyDown={preventSignOnKeyDown}
                  value={fields.quantity}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v.length > 7) return;
                    if (v === "" || isPositiveInteger(v))
                      handleField("quantity", v);
                  }}
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Karat</label>
                <select
                  className="form-control"
                  value={fields.karat}
                  onChange={(e) => handleField("karat", e.target.value)}
                >
                  <option value={KaratType.Karat18}>18K Gold</option>
                  <option value={KaratType.Karat21}>21K Gold</option>
                  <option value={KaratType.Karat22}>22K Gold</option>
                  <option value={KaratType.Karat24}>24K Gold</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Weight (grams)</label>
                <input
                  type="number"
                  onWheel={(e) => e.currentTarget.blur()}
                  step="0.1"
                  className="form-control"
                  placeholder="0.0"
                  value={fields.weight}
                  onKeyDown={preventSignOnKeyDown}
                  min={0}
                  onChange={(e) => {
                    if (e.target.value.length <= 12)
                      handleField("weight", e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Category</label>
                <select
                  className="form-control"
                  value={fields.category}
                  onChange={(e) => handleField("category", e.target.value)}
                >
                  <option value="">Select Category</option>
                  <option value={ProductCategory.Necklaces}>Necklaces</option>
                  <option value={ProductCategory.Bracelets}>Bracelets</option>
                  <option value={ProductCategory.Bangles}>Bangles</option>
                  <option value={ProductCategory.Rings}>Rings</option>
                  <option value={ProductCategory.Earrings}>Earrings</option>
                  <option value={ProductCategory.Pendants}>Pendants</option>
                  <option value={ProductCategory.Bullion}>Bullion</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            {requiresSize && (
              <div className="form-col">
                <div className="form-group">
                  <label className="form-label">Size</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g., 45"
                    value={fields.specification}
                    onChange={(e) =>
                      handleField("specification", e.target.value)
                    }
                  />
                </div>
              </div>
            )}
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Product Type</label>
                <select
                  className="form-control"
                  value={fields.productType}
                  onChange={(e) => handleField("productType", e.target.value)}
                >
                  <option value={ProductType.Gold}>Gold</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button
          className="btn-md btn-gray"
          onClick={onClose}
          disabled={isLoading}
        >
          <FaTimes className="icon" /> Cancel
        </button>
        <button
          className="btn-md btn-gold"
          onClick={handleConfirm}
          disabled={isInvalid || isLoading || !pricingSettings}
        >
          <FaSave className="icon" />
          {isLoading ? "Loading prices..." : "Add to Cart"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductModal;
