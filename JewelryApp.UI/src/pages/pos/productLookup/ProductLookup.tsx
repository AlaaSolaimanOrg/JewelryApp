import { useMemo, useState, type ChangeEvent } from "react";
import { Col, Row } from "react-bootstrap";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCartPlus,
  FaPen,
} from "react-icons/fa";
import { IoSearch } from "react-icons/io5";
import { Link } from "react-router-dom";
import { getProductById } from "../../../apis/products.api/products.api";
import { API_URL } from "../../../config/config";
import useLocalApi from "../../../hooks/useLocalApi";
import {
  checkRequestSucceeded,
  checkSKUFormat,
  debounce,
  safeValue,
  showError,
  showSuccess,
} from "../../../utils";
import type { Product } from "../../admin/inventory/Inventory";
import "./productLookup.scss";
import {
  addProductToCart,
  getCartProducts,
} from "../../../apis/cart.api/cart.api";
import type { CartProduct } from "../cartSummary/CartSummary";

const ProductLookup = () => {
  const [searchInput, setSearchInput] = useState("");
  const [searchBy, setSearchBy] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [anyProductAdded, setAnyProductAdded] = useState(false);

  const { data: cartProducts } = useLocalApi({
    apiToCall: (data) => getCartProducts(data.payload),
  }) as {
    data: CartProduct[];
  };

  const { data: product, setData: setProduct } = useLocalApi({
    apiToCall: (data) => getProductById(data.payload),
    payload: {
      searchBy: searchBy,
    },
    extraEffectCheck: !!searchBy && checkSKUFormat(searchBy),
    effectDependency: [searchBy],
    dataInitalValue: null,
  }) as {
    data: Product;
    setData: any;
  };

  const debouncedSetSearchBy = useMemo(
    () =>
      debounce((value: string) => {
        if (value?.length && value?.length < 20) {
          setSearchBy(value);
        } else {
          setSearchBy("");
        }
      }, 700),
    []
  );

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);
    debouncedSetSearchBy(inputValue);
    if (!inputValue) {
      setProduct(null);
    }
  };
  const totalPrice = (product?.pricePerGram ?? 0) * product?.weight;

  const handleAddToCartClick = (productId) => {
    setIsAddingProduct(true);

    const payload = { productId: productId, price: product.pricePerGram };
    addProductToCart(payload)
      .then((response) => {
        console.log("response",response)
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          setProduct(null);
          setSearchBy("");
          if (!anyProductAdded) {
            setAnyProductAdded(true);
          }
        } else {
          console.log("test")
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsAddingProduct(false);
      });
  };

  return (
    <div className="page-content productLookUp">
      <h3 className="d-flex align-items-center gap-2">
        <IoSearch /> Product Lookup
      </h3>
      <p className="subtitle">Scan barcode or search for jewelry items</p>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Scan or Enter Barcode/SKU..."
          value={searchInput}
          onChange={handleSearch}
          maxLength={17}
        />
        <button className="search-btn">
          <FaCamera />
          Scan
        </button>
      </div>

      {product ? (
        <div className="result-panel active">
          <Row className="product-details">
            <Col xs={4} md={12} className="product-image">
              <img src={`${API_URL}${product?.images?.[0]?.imageUrl}`} alt="" />
            </Col>
            <Col className="product-info" xs={8} md={12}>
              <h3 className="product-name">Diamond Solitaire Ring</h3>
              <div className="product-sku">SKU: GLD-21K-RNG-0042</div>

              <Row>
                <Col xs={12} md={6} className="detail-item">
                  <label>Karat</label>
                  <input
                    value={`${safeValue(product.karatType)}K`}
                    disabled
                    className="disabled-input-gold"
                  />
                </Col>
                <Col xs={12} md={6} className="detail-item">
                  <label>Weight (grams)</label>
                  <input
                    value={`${safeValue(product.weight)}`}
                    disabled
                    className="disabled-input-gold"
                  />
                </Col>
              </Row>

              <Row>
                <Col xs={12} className="detail-item">
                  <label>Price per gram</label>
                  <input
                    value={`${safeValue(product.pricePerGram)}`}
                    disabled
                    className="disabled-input-gold"
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <div className="price-display">Calculated Price: ${totalPrice}</div>

          <div className="action-buttons d-flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                handleAddToCartClick(product.id);
              }}
            >
              <FaCartPlus />
              Add to Cart
            </button>

            <Link to={"/manualItemEntry"} className="text-decoration-none temoporarylyHide">
              <button className="btn btn-secondary">
                <FaPen />
                Manual Entry
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="noResultsFound">
          <h3>No results found</h3>
        </div>
      )}

      <div className="footer-nav d-flex justify-content-between mt-3">
        <Link to={"/"} className="text-decoration-none">
          <button className="btn btn-secondary">
            <FaArrowLeft /> Back
          </button>
        </Link>

        <Link to={"/cartSummary"} className="text-decoration-none">
          <button
            className="btn btn-primary"
            disabled={!cartProducts.length && !anyProductAdded}
          >
            View Cart <FaArrowRight />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductLookup;
