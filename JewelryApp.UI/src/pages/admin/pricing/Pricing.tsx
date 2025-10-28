import { Col, Row } from "react-bootstrap";
import { FaSyncAlt, FaTag } from "react-icons/fa";
import {
  editPricingSettings,
  getGlobalPricingSettings,
  getPricingSettings,
} from "../../../apis/pricingSettings.api/pricingSettings.api";
import PricingCard from "../../../components/PricingCard/PricingCard";
import useLocalApi from "../../../hooks/useLocalApi";
import "./pricing.scss";
import { useEffect, useState, useMemo } from "react";
import { Currency, KaratType, ProductType } from "../../../types/enums";
import {
  checkRequestSucceeded,
  safeValue,
  showError,
  showSuccess,
} from "../../../utils";

export interface PriceItem {
  productType: ProductType;
  karatType: KaratType;
  pricePerGram: number;
}

interface MetalPricing {
  productType: "Silver" | "Gold";
  price_gram_24k: number;
  price_gram_22k: number;
  price_gram_21k: number;
  price_gram_20k: number;
  price_gram_18k: number;
  price_gram_16k: number;
  price_gram_14k: number;
  price_gram_10k: number;
}

const Pricing = () => {
  const [initialPrices, setInitialPrices] = useState<PriceItem[]>([
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
      karatType: KaratType.Karat22,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Gold,
      karatType: KaratType.Karat24,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Silver,
      karatType: KaratType.Karat18,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Silver,
      karatType: KaratType.Karat21,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Silver,
      karatType: KaratType.Karat22,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Silver,
      karatType: KaratType.Karat24,
      pricePerGram: 0,
    },
  ]);

  const [prices, setPrices] = useState<PriceItem[]>([...initialPrices]);

  const [globalGoldPrices, setGlobalGoldPrices] = useState<PriceItem[]>([
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
      karatType: KaratType.Karat22,
      pricePerGram: 0,
    },
    {
      productType: ProductType.Gold,
      karatType: KaratType.Karat24,
      pricePerGram: 0,
    },
  ]);

  // Check if prices have changed
  const hasChanges = useMemo(() => {
    if (initialPrices.length !== prices.length) return true;
    
    return prices.some((currentPrice, index) => {
      const initialPrice = initialPrices[index];
      return (
        currentPrice.pricePerGram !== initialPrice.pricePerGram ||
        currentPrice.productType !== initialPrice.productType ||
        currentPrice.karatType !== initialPrice.karatType
      );
    });
  }, [prices, initialPrices]);

  const handlePriceChange = (productType, karatType, value) => {
    setPrices((prev) =>
      prev.map((price) =>
        price.karatType === karatType && price.productType === productType
          ? { ...price, pricePerGram: value }
          : price
      )
    );
  };

  const handleProductTypePrices = (productType: ProductType) => {
    const removedOldPrices = prices.filter(
      (price) => price.productType != productType
    );

    setPrices([...removedOldPrices, ...globalGoldPrices]);
  };

  const { data: pricingSettings } = useLocalApi({
    apiToCall: () => getPricingSettings(),
  }) as {
    data: any;
    setData: any;
  };

  const {
    data: goldGlobalPricingSettings,
    fetchData: recallGoldGlobalPricingSettings,
  } = useLocalApi({
    apiToCall: (data) => getGlobalPricingSettings(data.payload),
    payload: {
      productType: ProductType.Gold,
      currency: Currency.USD,
    },
  }) as {
    data: MetalPricing;
    fetchData: any;
    setData: any;
  };

  useEffect(() => {
    if (pricingSettings && pricingSettings.length > 0) {
      const newPrices = initialPrices.map((oldPrice) => {
        const newPriceSetting = pricingSettings.find(
          (priceSetting) =>
            priceSetting.productType == oldPrice.productType &&
            priceSetting.karatType == oldPrice.karatType
        );

        return newPriceSetting ?? oldPrice;
      });
      
      setPrices(newPrices);
      setInitialPrices(newPrices); // Set both current and initial prices
    }
  }, [pricingSettings]);

  useEffect(() => {
    if (goldGlobalPricingSettings) {
      const newGlobalPrices = [
        {
          productType: ProductType.Gold,
          karatType: KaratType.Karat18,
          pricePerGram: safeValue(goldGlobalPricingSettings.price_gram_18k, 0),
        },
        {
          productType: ProductType.Gold,
          karatType: KaratType.Karat21,
          pricePerGram: safeValue(goldGlobalPricingSettings.price_gram_21k, 0),
        },
        {
          productType: ProductType.Gold,
          karatType: KaratType.Karat22,
          pricePerGram: safeValue(goldGlobalPricingSettings.price_gram_22k, 0),
        },
        {
          productType: ProductType.Gold,
          karatType: KaratType.Karat24,
          pricePerGram: safeValue(goldGlobalPricingSettings.price_gram_24k, 0),
        },
      ];
      setGlobalGoldPrices(newGlobalPrices);
    }
  }, [goldGlobalPricingSettings]);

  const callEditPrice = (prices) => {
    const payload = {
      pricingSettings: prices,
    };
    editPricingSettings(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          setInitialPrices(prices); // Update initial prices after successful save
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  const handleApplyPrices = () => {
    callEditPrice(prices);
  };

  return (
    <div id="pricing" className="page">
      <div className="page-header">
        <h1 className="page-title">
          <FaTag className="icon me-2" />
          <span>Pricing Control</span>
        </h1>
        <div className="page-actions">
          <button 
            className={`btn-md ${hasChanges ? 'btn-gold' : 'btn-dark'}`} 
            onClick={handleApplyPrices}
            disabled={!hasChanges}
          >
            <FaSyncAlt className="me-1" /> 
            {hasChanges ? 'Apply Prices' : 'No Changes'}
          </button>
        </div>
      </div>

      <Row>
        <Col sm={6}>
          <PricingCard
            cardTitle="Gold Pricing"
            productType={ProductType.Gold}
            prices={prices.filter(
              (price) => price.productType == ProductType.Gold
            )}
            handlePriceChange={handlePriceChange}
            handleProductTypePrices={handleProductTypePrices}
          />
        </Col>
        <Col sm={6}>
          <PricingCard
            cardTitle="Global Gold Pricing"
            productType={ProductType.Gold}
            prices={globalGoldPrices}
            isGlobal
            recallGlobalPrices={recallGoldGlobalPricingSettings}
          />
        </Col>
      </Row>
    </div>
  );
};

export default Pricing;