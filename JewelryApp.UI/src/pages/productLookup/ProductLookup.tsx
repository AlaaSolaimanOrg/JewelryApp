import { Link } from "react-router-dom";
import "./productLookup.scss";
import { IoSearch } from "react-icons/io5";
import { Col, Row } from "react-bootstrap";
import DefatulProductImage from "../../assets/images/default-product.png";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCartPlus,
  FaPen,
} from "react-icons/fa";

const ProductLookup = () => {
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
        />
        <button className="search-btn">
          <FaCamera />
          Scan
        </button>
      </div>

      <div className="result-panel active">
        <Row className="product-details">
          <Col xs={4} md={12}  className="product-image">
              <img src={DefatulProductImage} alt="" />
          </Col>
          <Col className="product-info" xs={8} md={12}>
            <h3 className="product-name">Diamond Solitaire Ring</h3>
            <div className="product-sku">SKU: GLD-21K-RNG-0042</div>

            <Row>
              <Col xs={12} md={6} className="detail-item">
                <label>Karat</label>
                <input value={"18K"} disabled className="disabled-input-gold" />
              </Col>
              <Col xs={12} md={6} className="detail-item">
                <label>Weight (grams)</label>
                <input value={"3.5"} disabled className="disabled-input-gold" />
              </Col>
            </Row>

            <Row>
              <Col xs={12} className="detail-item">
                <label>Price per gram</label>
                <input
                  value={"125.75"}
                  disabled
                  className="disabled-input-gold"
                />
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="price-display">Calculated Price: $440.13</div>

        <div className="action-buttons d-flex gap-2">
          <Link to={"/cartSummary"} className="text-decoration-none">
            <button className="btn btn-primary">
              <FaCartPlus />
              Add to Cart
            </button>
          </Link>

          <Link to={"/manualItemEntry"} className="text-decoration-none">
            <button className="btn btn-secondary">
              <FaPen />
              Manual Entry
            </button>
          </Link>
        </div>
      </div>

      <div className="footer-nav d-flex justify-content-between mt-3">
        <Link to={"/"} className="text-decoration-none">
          <button className="btn btn-secondary">
            <FaArrowLeft /> Back
          </button>
        </Link>

        <Link to={"/cartSummary"} className="text-decoration-none">
          <button className="btn btn-primary">
            View Cart <FaArrowRight />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductLookup;
