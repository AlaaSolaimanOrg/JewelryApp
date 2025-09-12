import { Col, Row } from "react-bootstrap";
import { FaSyncAlt, FaTag } from "react-icons/fa";
import {
  editPricingSettings,
  getPricingSettings,
} from "../../../apis/pricingSettings.api/pricingSettings.api";
import PricingCard from "../../../components/PricingCard/PricingCard";
import useLocalApi from "../../../hooks/useLocalApi";
import "./pricing.scss";
import { useEffect, useState } from "react";
import { KaratType, ProductType } from "../../../types/enums";
import { checkRequestSucceeded, showError, showSuccess } from "../../../utils";

export interface PriceItem {
  productType: ProductType;
  karatType: KaratType;
  pricePerGram: number;
}

const Pricing = () => {
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [prices, setPrices] = useState<PriceItem[]>([
    {
      productType: ProductType.Gold,
      karatType: KaratType.Karat18,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Gold,
      karatType: KaratType.Karat21,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Gold,
      karatType: KaratType.Karat24,
      pricePerGram: 0,
    },
  ]);

  const handlePriceChange = (karatType, value) => {
    setPrices((prev) =>
      prev.map((price) =>
        price.karatType === karatType
          ? { ...price, pricePerGram: value }
          : price
      )
    );
  };

  const { data: pricingSettings } = useLocalApi({
    apiToCall: (data) => getPricingSettings(data.payload),
  }) as {
    data: any;
    setData: any;
  };

  useEffect(() => {
    const newPrices = prices.map((oldPrice) => {
      const newPriceSetting = pricingSettings.find(
        (priceSetting) =>
          priceSetting.productType == oldPrice.productType &&
          priceSetting.karatType == oldPrice.karatType
      );

      return newPriceSetting ?? oldPrice;
    });
    setPrices(newPrices);
  }, [pricingSettings]);
  console.log("pricingSettings", pricingSettings);
  console.log("prices", prices);

  const callEditPrice = (productType, karatType, pricePerGram) => {
    setIsEditingPrices(true);

    const payload = {
      productType: productType,
      karatType: karatType,
      pricePerGram: pricePerGram,
    };
    editPricingSettings(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          console.log("response", response);
          showSuccess(response?.message);
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      })
      .finally(() => {
        setIsEditingPrices(false);
      });
  };

  const handleApplyPrices = () => {
    prices.forEach((price) => {
      callEditPrice(price.productType, price.karatType, price.pricePerGram);
    });
  };
  
  return (
    <div id="pricing" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaTag className="icon me-2" />
          <span>Pricing Control</span>
        </h1>
        <div className="page-actions">
          <button className="btn-md btn-gold" onClick={handleApplyPrices}>
            <FaSyncAlt className="me-1" /> Apply Prices
          </button>
        </div>
      </div>

      <Row>
        <Col sm={6}>
          <PricingCard prices={prices} handlePriceChange={handlePriceChange} />
        </Col>
        <Col sm={6}>
          <PricingCard isGlobal />
        </Col>
      </Row>
    </div>
  );
};

export default Pricing;
