import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiFillPrinter } from "react-icons/ai";
import { FaSave, FaTimes } from "react-icons/fa";
import { IoBarcodeSharp } from "react-icons/io5";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  editProduct,
  generateSKU,
  getProductById,
} from "../../../apis/products.api/products.api";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import LoadingScreen from "../../../components/LoadingScreen/LoadingScreen";
import TagPrintingModal from "../../../components/modals/TagPrintingModal/TagPrintingModal";
import useLocalApi from "../../../hooks/useLocalApi";
import { KaratType, ProductCategory, ProductType } from "../../../types/enums";
import preventSignOnKeyDown, {
  checkRequestSucceeded,
  isPositiveInteger,
  showError,
  showSuccess,
  urlToFile,
} from "../../../utils";
import "./addEditProduct.scss";

const productFieldsInitialState = {
  productName: "",
  sku: "",
  karat: "",
  productType: ProductType.Gold,
  weight: "",
  category: "",
  description: "",
  quantity: 1,
  tags: [] as string[],
  specification: "", // ✅ NEW FIELD
};

const AddEditProduct = ({ isEdit }) => {
  const navigate = useNavigate();
  const [isLoadingCreateProduct, setIsLoadingCreateProduct] = useState(false);
  const [productFields, setProductFields] = useState(productFieldsInitialState);
  const [files, setFiles] = useState([]);
  const [tagInput, setTagInput] = useState(""); // For new tag input
  const [showTagPrintingModal, setShowTagPrintingModal] = useState(false);

  const { productId } = useParams();

  const handleProductField = (fieldName, value) => {
    setProductFields((pre) => {
      return {
        ...pre,
        [fieldName]: value,
      };
    });
  };

  // Add a new tag
  const handleAddTag = () => {
    if (tagInput.trim() && !productFields.tags.includes(tagInput.trim())) {
      setProductFields((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  // Remove a tag
  const handleRemoveTag = (tagToRemove: string) => {
    setProductFields((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle Enter key in tag input
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const { data: generatedSKU, setData: setGeneratedSKU } = useLocalApi({
    apiToCall: (data) => generateSKU(data.payload),
    payload: {
      category: productFields.category,
    },
    extraEffectCheck: !!productFields.category,
    effectDependency: [productFields.category],
  }) as {
    data: any;
    setData: any;
  };

  const { data: product } = useLocalApi({
    apiToCall: (data) => getProductById(data.payload),
    payload: {
      id: productId,
    },
    extraEffectCheck: !!productId,
    effectDependency: [productId],
  }) as {
    data: any;
  };

  useEffect(() => {
    if (!isEdit) {
      handleClearClick();
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit && product) {
      setProductFields({
        productName: product.name,
        sku: product.sku,
        karat: product.karatType,
        productType: product.productType,
        weight: product.weight,
        category: product.category,
        description: product.description,
        quantity: product.quantity,
        tags: product.tags || [],
        specification: product.specification || [],
      });

      const loadFiles = async () => {
        const apiFiles: any = await Promise.all(
          product?.images?.map(async (file, index) => {
            const fullUrl = `${import.meta.env.VITE_API_URL}${file.imageUrl}`;
            const fetchedFile = await urlToFile(fullUrl, `image-${index}.jpg`);
            return Object.assign(fetchedFile, { preview: fullUrl });
          }),
        );
        setFiles(apiFiles);
      };

      loadFiles();
    }
  }, [product, isEdit]);

  useEffect(() => {
    if (!isEdit) {
      handleProductField("sku", generatedSKU);
    }
  }, [generatedSKU, isEdit]);

  const handleClearClick = () => {
    setProductFields(productFieldsInitialState);
    setFiles([]);
    setTagInput("");
    setGeneratedSKU(null);
  };

  const callCreateProduct = () => {
    setIsLoadingCreateProduct(true);

    const formData = new FormData();

    if (isEdit && productId) {
      formData.append("Id", productId);
    }

    formData.append("Name", productFields.productName);
    formData.append("Sku", productFields.sku);
    formData.append("Category", productFields.category);
    formData.append("Specification", productFields.specification);
    formData.append("Type", productFields.productType.toString());
    formData.append("KaratType", productFields.karat);
    formData.append("Description", productFields.description);
    formData.append("Weight", productFields.weight);
    formData.append("quantity", productFields.quantity?.toString());

    // Append tags as JSON array
    if (productFields.tags.length > 0) {
      productFields.tags.forEach((tag) => formData.append("Tags", tag));
    }

    if (files && files.length > 0) {
      files.forEach(async (file) => {
        formData.append("Images", file);
      });
    }

    const apiToCall = isEdit ? editProduct : createProduct;
    apiToCall(formData)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          if (isEdit) {
            navigate("/admin/inventory/products");
          } else {
            handleClearClick();
          }
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
      if (key === "description" || key === "tags" || key == "specification")
        return false;

      if (key === "weight" || key === "quantity") {
        return Number(value) <= 0;
      }

      if (Array.isArray(value)) {
        return value.length === 0;
      }
      return !value;
    },
  );

  const categoriesRequiringSize = [
    ProductCategory.Necklaces,
    ProductCategory.Bracelets,
    ProductCategory.Rings,
  ];
  return (
    <div id="add-product-page" className="page">
      <div className="page-header">
        <h1 className="page-title ">
          <MdOutlineAddShoppingCart className="icon" />
          {isEdit ? <span>Edit Product</span> : <span>Add New Product</span>}
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gray" onClick={handleClearClick}>
            <FaTimes className="icon" />
            clear
          </button>
          <button
            className="btn-md btn-info"
            onClick={() => {
              navigate("/admin/inventory/products");
            }}
          >
            <FaTimes className="icon" />
            Back To Inventory
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

            <div className="form-col">
              <div className="form-group">
                <label className="form-label">SKU</label>
                <input
                  key={productFields.sku}
                  type="text"
                  className="form-control disabled-gold"
                  placeholder="Auto Generated SKU"
                  value={productFields.sku}
                  disabled={true}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row"></div>

          <div className="form-row">
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Quantity</label>
                <input
                  type="number"
                  min={1} // ensures positive
                  step={1} // disables decimals
                  className="form-control"
                  placeholder="Enter quantity"
                  onKeyDown={preventSignOnKeyDown}
                  value={productFields.quantity}
                  onChange={(e) => {
                    const value = e.target.value;

                    if (value.length > 7) {
                      return;
                    } else if (value === "" || isPositiveInteger(value)) {
                      handleProductField("quantity", value);
                    }
                  }}
                  required
                />
              </div>
            </div>
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
                  step="0.1"
                  className="form-control"
                  placeholder="0.0"
                  value={productFields.weight}
                  onKeyDown={preventSignOnKeyDown}
                  min={0}
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
            <div className="form-col">
              <div className="form-group">
                <label className="form-label required">Category</label>
                <select
                  className={`form-control ${isEdit ? "disabled-gold" : ""}`}
                  disabled={isEdit}
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

            {/* LENGTH for Necklaces */}
            {categoriesRequiringSize.includes(
              Number(productFields.category),
            ) && (
              <div className="form-group">
                <label className="form-label required">Size</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., 45"
                  value={productFields.specification}
                  onChange={(e) =>
                    handleProductField("specification", e.target.value)
                  }
                  required
                />
              </div>
            )}

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

          {/* Tags Section */}
          <div className="form-group">
            <label className="form-label">Tags (Optional)</label>
            <div className="tags-input-container">
              <div className="tags-display">
                <div className="tag-input-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add a tag and press Enter or click Add"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                  />
                  <button
                    type="button"
                    className="btn-sm btn-gold"
                    onClick={handleAddTag}
                    disabled={
                      !tagInput.trim() ||
                      productFields.tags.some((tag) => tag === tagInput.trim())
                    }
                  >
                    Add
                  </button>
                </div>
                <div>
                  {productFields.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        className="tag-remove"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {productFields.sku && (
            <div className="barcodeGenerator">
              <div className="titleContainer">
                <IoBarcodeSharp className="icon" />
                <span className="title">Barcode</span>
              </div>

              <div className="barCodeWrapper">
                <Barcode className="barCode" value={productFields.sku} />
              </div>

              <div className="actionsContainer">
                <AiFillPrinter
                  className="icon"
                  onClick={() => {
                    setShowTagPrintingModal(true);
                  }}
                />
              </div>
            </div>
          )}

          <ImageUpload files={files} setFiles={setFiles} />
        </form>
      </div>
      <TagPrintingModal
        show={showTagPrintingModal}
        onClose={() => {
          setShowTagPrintingModal(false);
        }}
        product={
          {
            sku: productFields.sku,
            weight: productFields.weight,
            karatType: productFields.karat,
            specification: productFields.specification,
            price: 333,
          } as any
        }
      />
      <LoadingScreen isLoading={isLoadingCreateProduct} />
    </div>
  );
};

export default AddEditProduct;
