import { useEffect, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { TbCirclePlusFilled } from "react-icons/tb";
import {
  createProduct,
  generateSKU,
} from "../../../apis/products.api/products.api";
import { KaratType, ProductCategory, ProductType } from "../../../types/enums";
import useLocalApi from "../../../useLocalApi";
import "./addProduct.scss";
import { checkRequestSucceeded } from "../../../utils";
import type { CreateProductPayload } from "../../../apis/products.api/products.api.type";

interface Field<T> {
  value: T;
  isValid: boolean;
  errorMessage: string;
}

interface ProductFields {
  productName: Field<string>;
  SKU: Field<string>;
  karat: Field<KaratType | null>;
  productType: Field<ProductType | null>;
  weight: Field<number | "">;
  category: Field<ProductCategory | null>;
  sizeDetails: Field<string>;
  description: Field<string>;
  tags: Field<string[]>;
  productImage: Field<File | "">;
}

const AddProduct = () => {
  const [isLoadingCreateProduct, setIsLoadingCreateProduct] = useState(false);
  const [productFields, setProductFields] = useState<ProductFields>({
    productName: { value: "", isValid: false, errorMessage: "" },
    SKU: { value: "", isValid: false, errorMessage: "" },
    karat: { value: null, isValid: false, errorMessage: "" },
    productType: { value: null, isValid: false, errorMessage: "" },
    weight: { value: "", isValid: false, errorMessage: "" },
    category: { value: null, isValid: false, errorMessage: "" },
    sizeDetails: { value: "", isValid: false, errorMessage: "" },
    description: { value: "", isValid: false, errorMessage: "" },
    tags: { value: [], isValid: false, errorMessage: "" },
    productImage: { value: "", isValid: false, errorMessage: "" },
  });

  const handleProductField = (fieldName, property, value) => {
    setProductFields((pre) => {
      return {
        ...pre,
        [fieldName]: {
          ...pre[fieldName],
          [property]: value,
        },
      };
    });
  };

  const { data: generatedSKU } = useLocalApi({
    apiToCall: (data) => generateSKU(data.payload),
    payload: {
      karatType: productFields.karat.value,
      category: productFields.category.value,
    },
    extraEffectCheck:
      !!productFields.karat.value && !!productFields.category.value,
    effectDependency: [productFields.karat.value, productFields.category.value],
  }) as {
    data: any;
  };

  useEffect(() => {
    handleProductField("SKU", "value", generatedSKU);
  }, [generatedSKU]);

  const callCreateProduct = () => {
    setIsLoadingCreateProduct(true);

    const payload: CreateProductPayload = {
      name: productFields.productName.value,
      sku: productFields.SKU.value,
      category: productFields.category.value as ProductCategory,
      type: productFields.productType.value as ProductType,
      karatType: productFields.karat.value as KaratType,
      description: productFields.description.value || undefined,
      weight: Number(productFields.weight.value),
      images: productFields.productImage.value
        ? [productFields.productImage.value as File]
        : [],
    };

    createProduct(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.status)) {
        } else {
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsLoadingCreateProduct(false);
      });
  };

  return (
    <div id="add-product-page" className="page">
      <div className="page-header">
        <h1 className="page-title ">
          <TbCirclePlusFilled className="icon" />
          <span>Add New Product</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gray">
            <FaTimes className="icon" />
            Cancel
          </button>
          <button className="btn-md btn-gold">
            <FaSave className="icon" /> Save Product
          </button>
        </div>
      </div>

      <div className="card">
        <form id="product-form">
          {/* Product Name */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Product Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter product name"
                  value={productFields.productName.value}
                  onChange={(e) =>
                    handleProductField("productName", "value", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* SKU */}
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">SKU</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Generate SKU"
                  value={generatedSKU}
                  disabled={true}
                  required
                />
              </div>
            </div>
          </div>

          {/* Karat & Weight */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Karat</label>
                <select
                  className="form-control"
                  value={productFields.karat.value}
                  onChange={(e) =>
                    handleProductField("karat", "value", e.target.value)
                  }
                  required
                >
                  <option value="">Select Karat</option>
                  <option value={KaratType.Karat18}>18K Gold</option>
                  <option value={KaratType.Karat21}>21K Gold</option>
                  <option value={KaratType.Karat24}>22K Gold</option>
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Weight (grams)</label>
                <input
                  type="number"
                  step="0.1"
                  className="form-control"
                  placeholder="0.0"
                  value={productFields.weight.value}
                  onChange={(e) =>
                    handleProductField("weight", "value", e.target.value)
                  }
                  required
                />
              </div>
            </div>
          </div>

          {/* Category  */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Category</label>
                <select
                  className="form-control"
                  value={productFields.category.value}
                  onChange={(e) =>
                    handleProductField("category", "value", e.target.value)
                  }
                  required
                >
                  <option value="">Select Category</option>
                  <option value={ProductCategory.Necklaces}>Necklaces</option>
                  <option value={ProductCategory.Bracelets}>Bracelets</option>
                  <option value={ProductCategory.Rings}>Rings</option>
                  <option value={ProductCategory.Earrings}>Earrings</option>
                  <option value={ProductCategory.Pendants}>Pendants</option>
                  <option value={ProductCategory.Bullion}>Bullion</option>
                </select>
              </div>
            </div>
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Size Details</label>
                <div className="form-row">
                  <div className="form-col">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Ring size (if applicable)"
                      value={productFields.sizeDetails.value}
                      onChange={(e) =>
                        handleProductField(
                          "sizeDetails",
                          "value",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Produc Type  */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Product Type</label>
                <select
                  className="form-control"
                  value={productFields.productType.value}
                  onChange={(e) =>
                    handleProductField("productType", "value", e.target.value)
                  }
                  required
                >
                  <option value="">Select Type</option>
                  <option value={ProductType.Gold}>Gold</option>
                  <option value={ProductType.Silver}>Silver</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              <label className="filter-option" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={productFields.tags.value.includes("new")}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...productFields.tags.value, "new"]
                      : productFields.tags.value.filter((tag) => tag !== "new");
                    handleProductField("tags", "value", newValue);
                  }}
                />{" "}
                New Arrival
              </label>
              <label className="filter-option" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={productFields.tags.value.includes("featured")}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...productFields.tags.value, "featured"]
                      : productFields.tags.value.filter(
                          (tag) => tag !== "featured"
                        );
                    handleProductField("tags", "value", newValue);
                  }}
                />{" "}
                Featured
              </label>
              <label className="filter-option" style={{ margin: 0 }}>
                <input
                  type="checkbox"
                  checked={productFields.tags.value.includes("premium")}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...productFields.tags.value, "premium"]
                      : productFields.tags.value.filter(
                          (tag) => tag !== "premium"
                        );
                    handleProductField("tags", "value", newValue);
                  }}
                />{" "}
                Premium
              </label>
            </div>
          </div>

          {/* Product Image */}
          <div className="form-group">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleProductField("productImage", "value", e.target.files[0])
              }
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
