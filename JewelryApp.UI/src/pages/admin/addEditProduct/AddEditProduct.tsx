import { useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiFillPrinter } from "react-icons/ai";
import { FaArrowLeft, FaPause, FaSave, FaTimes } from "react-icons/fa";
import { MdOutlineAddShoppingCart } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import {
  createProduct,
  editProduct,
  generateSKU,
  getProductById,
} from "../../../apis/products.api/products.api";
import ImageUpload from "../../../components/ImageUpload/ImageUpload";
import LoadingScreen from "../../../components/loaders/LoadingScreen/LoadingScreen";
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
  const [keepFieldsAfterSave, setKeepFieldsAfterSave] = useState(false);

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

  const {
    data: generatedSKU,
    fetchData: recallGenerateSKU,
    setData: setGeneratedSKU,
  } = useLocalApi({
    apiToCall: (data) => generateSKU(data.payload),
    payload: {
      category: productFields.category,
    },
    extraEffectCheck: !!productFields.category,
    effectDependency: [productFields.category],
  }) as {
    data: any;
    setData: any;
    fetchData: () => void;
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
          } else if (keepFieldsAfterSave) {
            handleProductField("weight", "");
            recallGenerateSKU();
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
    ProductCategory.Bangles,
  ];

  const showSizeField = categoriesRequiringSize.includes(
    Number(productFields.category),
  );

  return (
    <div id="add-product-page" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <MdOutlineAddShoppingCart className="icon" />
          <span>{isEdit ? "Edit product" : "Add new product"}</span>
        </h1>

        <div className="page-actions">
          {!isEdit && (
            <button
              type="button"
              className={`btn-md btn-outline ${keepFieldsAfterSave ? "active" : ""}`}
              onClick={() => setKeepFieldsAfterSave((v) => !v)}
            >
              <FaPause className="icon" /> Preserve
            </button>
          )}

          <button className="btn-md btn-outline" onClick={handleClearClick}>
            <FaTimes className="icon" /> Clear
          </button>

          <button
            className="btn-md btn-outline"
            onClick={() => navigate("/admin/inventory/products")}
          >
            <FaArrowLeft className="icon" /> Back to inventory
          </button>

          <button
            className="btn-md btn-gold"
            disabled={checkAnyProductFieldHasNoValue}
            onClick={callCreateProduct}
          >
            <FaSave className="icon" /> Save product
          </button>
        </div>
      </div>

      <div className="panel">
        <form id="product-form" className="form-grid">
          <div className="fg">
            <label>
              Product name <span className="req">*</span>
            </label>
            <input
              type="text"
              maxLength={100}
              placeholder="Enter product name"
              value={productFields.productName}
              onChange={(e) =>
                handleProductField("productName", e.target.value)
              }
              required
            />
          </div>

          <div className="fg">
            <label>SKU</label>
            <input
              key={productFields.sku}
              type="text"
              className="disabled-gold"
              placeholder="Auto generated"
              value={productFields.sku}
              disabled
              required
            />
          </div>

          <div className="fg">
            <label>
              Quantity <span className="req">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              min={1}
              step={1}
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

          <div className="fg">
            <label>
              Karat <span className="req">*</span>
            </label>
            <select
              value={productFields.karat}
              onChange={(e) => handleProductField("karat", e.target.value)}
              required
            >
              <option value="">Select karat</option>
              <option value={KaratType.Karat18}>18K Gold</option>
              <option value={KaratType.Karat21}>21K Gold</option>
              <option value={KaratType.Karat22}>22K Gold</option>
              <option value={KaratType.Karat24}>24K Gold</option>
            </select>
          </div>

          <div className="fg">
            <label>
              Weight (grams) <span className="req">*</span>
            </label>
            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              step="0.1"
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

          <div className="fg">
            <label>
              Category <span className="req">*</span>
            </label>
            <select
              className={isEdit ? "disabled-gold" : ""}
              disabled={isEdit}
              value={productFields.category}
              onChange={(e) => handleProductField("category", e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value={ProductCategory.Necklaces}>Necklaces</option>
              <option value={ProductCategory.Bracelets}>Bracelets</option>
              <option value={ProductCategory.Bangles}>Bangles</option>
              <option value={ProductCategory.Rings}>Rings</option>
              <option value={ProductCategory.Earrings}>Earrings</option>
              <option value={ProductCategory.Pendants}>Pendants</option>
              <option value={ProductCategory.Bullion}>Bullion</option>
            </select>
          </div>

          {showSizeField && (
            <div className="fg">
              <label>
                Size <span className="req">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 45"
                value={productFields.specification}
                onChange={(e) =>
                  handleProductField("specification", e.target.value)
                }
                required
              />
            </div>
          )}

          <div className="fg">
            <label>
              Product type <span className="req">*</span>
            </label>
            <select
              value={productFields.productType}
              onChange={(e) =>
                handleProductField("productType", e.target.value)
              }
              required
            >
              <option value="">Select type</option>
              <option value={ProductType.Gold}>Gold</option>
              <option value={ProductType.Silver}>Silver</option>
            </select>
          </div>

          <div className="fg">
            <label>
              Tags <span className="opt">(optional)</span>
            </label>
            <div className="tags-row">
              <input
                type="text"
                placeholder="Add tag, press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
              />
              <button
                type="button"
                className="btn-md btn-outline"
                onClick={handleAddTag}
                disabled={
                  !tagInput.trim() ||
                  productFields.tags.some((tag) => tag === tagInput.trim())
                }
              >
                Add
              </button>
            </div>

            {productFields.tags.length > 0 && (
              <div className="tags-list">
                {productFields.tags.map((tag, index) => (
                  <span key={index} className="tag">
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <FaTimes />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="fg span3">
            <label>Description</label>
            <textarea
              value={productFields.description}
              onChange={(e) =>
                handleProductField("description", e.target.value)
              }
              placeholder="Enter product description"
              rows={3}
            />
          </div>

          {productFields.sku && (
            <div className="fg span3">
              <label>Barcode</label>
              <div className="barcode-strip">
                <div className="barcode-preview">
                  <Barcode className="barCode" value={productFields.sku} />
                </div>

                <button
                  type="button"
                  className="btn-md btn-outline"
                  onClick={() => setShowTagPrintingModal(true)}
                >
                  <AiFillPrinter className="icon" /> Print tag
                </button>
              </div>
            </div>
          )}

          <div className="fg span3">
            <label>
              Product images <span className="req">*</span>
            </label>
            <ImageUpload files={files} setFiles={setFiles} />
          </div>
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
