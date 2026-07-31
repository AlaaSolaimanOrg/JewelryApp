import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaSave, FaTimes } from "react-icons/fa";
import {
  createProduct,
  generateSKU,
  getProductsBySkus,
} from "../../../apis/products.api/products.api";
import { KaratType, ProductCategory, ProductType } from "../../../types/enums";
import preventSignOnKeyDown, {
  checkRequestSucceeded,
  isPositiveInteger,
  showError,
  showSuccess,
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
  sku: "",
  karat: String(KaratType.Karat18),
  productType: String(ProductType.Gold),
  weight: "",
  category: "",
  specification: "",
  quantity: 1,
};

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

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setFields(initialFields);
    }
  }, [show]);

  // Auto-generate SKU when category changes
  useEffect(() => {
    if (!fields.category) {
      setFields((prev) => ({ ...prev, sku: "" }));
      return;
    }
    generateSKU({
      category: fields.category as any,
      karatType: fields.karat as any,
    })
      .then((res) => {
        if (checkRequestSucceeded(res?.statusCode)) {
          setFields((prev) => ({ ...prev, sku: res.data ?? "" }));
        }
      })
      .catch(() => {});
  }, [fields.category, fields.karat]);

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
    if (isInvalid || isLoading) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append("Name", fields.productName);
    formData.append("Sku", fields.sku);
    formData.append("Category", fields.category);
    formData.append("Specification", fields.specification);
    formData.append("Type", fields.productType);
    formData.append("KaratType", fields.karat);
    formData.append("Description", "");
    formData.append("Weight", fields.weight);
    formData.append("quantity", String(fields.quantity));

    createProduct(formData)
      .then((res) => {
        if (checkRequestSucceeded(res?.statusCode)) {
          showSuccess(res?.message);
          return getProductsBySkus({ skus: [fields.sku] });
        } else {
          showError(res?.message);
          return null;
        }
      })
      .then((skuRes) => {
        if (!skuRes) return;
        const fetched = skuRes?.data ?? [];
        const p = fetched[0];
        if (!p) {
          showError("Could not retrieve created product.");
          return;
        }
        onProductAdded({
          ...p,
          originalPricePerGram: p.pricePerGram,
          quantityForSale: 1,
          manual: false,
        });
        onClose();
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      className="add-product-modal"
      container={() => document.querySelector(".pos-app") || document.body}
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
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  type="text"
                  className="form-control disabled-gold"
                  placeholder="Auto Generated SKU"
                  value={fields.sku}
                  disabled
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
                  <option value={ProductType.Silver}>Silver</option>
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
          disabled={isInvalid || isLoading}
        >
          <FaSave className="icon" />
          {isLoading ? "Saving..." : "Add to Cart"}
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddProductModal;
