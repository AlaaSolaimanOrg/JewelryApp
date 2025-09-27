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
import { useEffect, useState } from "react";
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

  const [globalSilverPrices, setGlobalSilverPrices] = useState<PriceItem[]>([
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
    const globalPrices =
      productType == ProductType.Gold ? globalGoldPrices : globalSilverPrices;
    setPrices([...removedOldPrices, ...globalPrices]);
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

  // const {
  //   data: silverGlobalPricingSettings,
  //   fetchData: recallSilverGlobalPricingSettings,
  // } = useLocalApi({
  //   apiToCall: (data) => getGlobalPricingSettings(data.payload),
  //   payload: {
  //     productType: ProductType.Silver,
  //     currency: Currency.USD,
  //   },
  // }) as {
  //   data: MetalPricing;
  //   fetchData: any;
  //   setData: any;
  // };

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

  useEffect(() => {
    setGlobalGoldPrices([
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
    ]);
  }, [goldGlobalPricingSettings]);

  // useEffect(() => {
  //   setGlobalSilverPrices([
  //     {
  //       productType: ProductType.Silver,
  //       karatType: KaratType.Karat18,
  //       pricePerGram: safeValue(silverGlobalPricingSettings.price_gram_18k, 0),
  //     },
  //     {
  //       productType: ProductType.Silver,
  //       karatType: KaratType.Karat21,
  //       pricePerGram: safeValue(silverGlobalPricingSettings.price_gram_21k, 0),
  //     },
  //     {
  //       productType: ProductType.Silver,
  //       karatType: KaratType.Karat22,
  //       pricePerGram: safeValue(silverGlobalPricingSettings.price_gram_22k, 0),
  //     },
  //     {
  //       productType: ProductType.Silver,
  //       karatType: KaratType.Karat24,
  //       pricePerGram: safeValue(silverGlobalPricingSettings.price_gram_24k, 0),
  //     },
  //   ]);
  // }, [silverGlobalPricingSettings]);

  const callEditPrice = (prices) => {
    setIsEditingPrices(true);

    const payload = {
      pricingSettings: prices,
    };
    editPricingSettings(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
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
          <button className="btn-md btn-gold" onClick={handleApplyPrices}>
            <FaSyncAlt className="me-1" /> Apply Prices
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
            globalPrices={goldGlobalPricingSettings}
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

      {/* <Row >
        <Col sm={6}>
          <PricingCard
            cardTitle="Silver Pricing"
            productType={ProductType.Silver}
            prices={prices.filter(
              (price) => price.productType == ProductType.Silver
            )}
            globalPrices={silverGlobalPricingSettings}
            handlePriceChange={handlePriceChange}
            handleProductTypePrices={handleProductTypePrices}
          />
        </Col>
        <Col sm={6}>
          <PricingCard
            cardTitle="Global Silver Pricing"
            productType={ProductType.Silver}
            prices={globalSilverPrices}
            isGlobal
            recallGlobalPrices={recallSilverGlobalPricingSettings}
          />
        </Col>
      </Row> */}
    </div>
  );
};

export default Pricing;
