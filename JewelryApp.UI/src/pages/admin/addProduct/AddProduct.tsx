import { useEffect, useState } from "react";
import { FaSave, FaTimes } from "react-icons/fa";
import { TbCirclePlusFilled } from "react-icons/tb";
import {
  createProduct,
  generateSKU,
} from "../../../apis/products.api/products.api";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import { KaratType, ProductCategory, ProductType } from "../../../types/enums";
import useLocalApi from "../../../hooks/useLocalApi";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";
import "./addProduct.scss";

const productFieldsInitialState = {
  productName: "",
  SKU: "",
  karat: "",
  productType: "",
  weight: "",
  category: "",
  sizeDetails: "",
  description: "",
};

const AddProduct = () => {
  const [isLoadingCreateProduct, setIsLoadingCreateProduct] = useState(false);
  const [productFields, setProductFields] = useState(productFieldsInitialState);

  const [files, setFiles] = useState([]);

  console.log("files", files);

  const handleProductField = (fieldName, value) => {
    setProductFields((pre) => {
      return {
        ...pre,
        [fieldName]: value,
      };
    });
  };

  console.log("productFields", productFields);
  const { data: generatedSKU, setData: setGeneratedSKU } = useLocalApi({
    apiToCall: (data) => generateSKU(data.payload),
    payload: {
      karatType: productFields.karat,
      category: productFields.category,
    },
    extraEffectCheck: !!productFields.karat && !!productFields.category,
    effectDependency: [productFields.karat, productFields.category],
  }) as {
    data: any;
    setData: any;
  };
  console.log("generatedSKU", generatedSKU);

  useEffect(() => {
    handleProductField("SKU", generatedSKU);
  }, [generatedSKU]);

  const handleCancelAddProduct = () => {
    setProductFields(productFieldsInitialState);
    setFiles([]);
    setGeneratedSKU(null);
  };

  const callCreateProduct = () => {
    setIsLoadingCreateProduct(true);

    const formData = new FormData();

    formData.append("Name", productFields.productName);
    formData.append("Sku", productFields.SKU);
    formData.append("Category", productFields.category);
    formData.append("Type", productFields.productType);
    formData.append("KaratType", productFields.karat);
    formData.append("Description", productFields.description);
    formData.append("Weight", productFields.weight);

    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("Images", file);
      });
    }

    createProduct(formData)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          console.log("response", response);
          handleCancelAddProduct();
          showSuccess(response?.message);
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsLoadingCreateProduct(false);
      });
  };

  const checkAnyProductFieldHasNoValue = Object.entries(productFields).some(
    ([key, value]) => {
      console.log({ key, value });
      if (key === "description") return false;
      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return !value;
    }
  );

  return (
    <div id="add-product-page" className="page">
      <div className="page-header">
        <h1 className="page-title ">
          <TbCirclePlusFilled className="icon" />
          <span>Add New Product</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gray" onClick={handleCancelAddProduct}>
            <FaTimes className="icon" />
            Cancel
          </button>

          <button
            className="btn-md btn-gold"
            disabled={checkAnyProductFieldHasNoValue || !files.length}
            onClick={callCreateProduct}
          >
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
                  maxLength={100}
                  className="form-control"
                  placeholder="Enter product name"
                  value={productFields.productName}
                  onChange={(e) =>
                    handleProductField("productName", e.target.value)
                  }
                  required
                />
              </div>
            </div>

            {/* SKU */}
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  key={generatedSKU}
                  type="text"
                  className="form-control disabled-gold"
                  placeholder="Auto Generated SKU"
                  value={generatedSKU}
                  disabled={true}
                  required
                />
              </div>
            </div>
          </div>

          {/* Karat */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Karat</label>
                <select
                  className="form-control"
                  value={productFields.karat}
                  onChange={(e) => handleProductField("karat", e.target.value)}
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
                  value={productFields.weight}
                  onChange={(e) => {
                    const inputValue = e.target.value;

                    if (inputValue.length <= 12) {
                      handleProductField("weight", inputValue);
                    }
                  }}
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
                  value={productFields.category}
                  onChange={(e) =>
                    handleProductField("category", e.target.value)
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
                      maxLength={100}
                      className="form-control"
                      placeholder="Ring size (if applicable)"
                      value={productFields.sizeDetails}
                      onChange={(e) =>
                        handleProductField("sizeDetails", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Type  */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Product Type</label>
                <select
                  className="form-control"
                  value={productFields.productType}
                  onChange={(e) =>
                    handleProductField("productType", e.target.value)
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

          {/* Description */}
          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  value={productFields.description}
                  onChange={(e) =>
                    handleProductField("description", e.target.value)
                  }
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Tags */}
          {/* <div className="form-group">
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
                    handleProductField("tags", newValue);
                  }}
                />
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
                    handleProductField("tags", newValue);
                  }}
                />
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
                    handleProductField("tags", newValue);
                  }}
                />
                Premium
              </label>
            </div>
          </div> */}

          {/* Product Image */}
          {/* <div className="form-group">
            <label className="form-label">Product Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleProductField("productImage", e.target.files[0])
              }
            />
          </div> */}
          <ImageUpload files={files} setFiles={setFiles} />
        </form>
      </div>
      <LoadingScreen isLoading={isLoadingCreateProduct} />
    </div>
  );
};

export default AddProduct;
