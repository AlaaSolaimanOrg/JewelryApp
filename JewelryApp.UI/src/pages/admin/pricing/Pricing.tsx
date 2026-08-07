import { FaSyncAlt, FaTag } from "react-icons/fa";
import {
  editPricingSettings,
  getPricingSettings,
} from "../../../apis/pricingSettings.api/pricingSettings.api";
import KaratPriceCard from "../../../components/KaratPriceCard/KaratPriceCard";
import useLocalApi from "../../../hooks/useLocalApi";
import "./pricing.scss";
import { useEffect, useMemo, useState } from "react";
import { KaratType, ProductType } from "../../../types/enums";
import {
  checkRequestSucceeded,
  showError,
  showSuccess,
} from "../../../utils";
import type { PriceItem } from "./Pricing.type";
import { buildKaratCards, computeTotalStockValue, fmtCurrency } from "./Pricing.utils";

const GOLD_KARATS = [
  KaratType.Karat18,
  KaratType.Karat21,
  KaratType.Karat22,
  KaratType.Karat24,
];

const emptyGoldPrices = (): PriceItem[] =>
  GOLD_KARATS.map((karatType) => ({
    productType: ProductType.Gold,
    karatType,
    pricePerGram: 0,
  }));

const Pricing = () => {
  const [initialPrices, setInitialPrices] = useState<PriceItem[]>(
    emptyGoldPrices()
  );
  const [prices, setPrices] = useState<PriceItem[]>(emptyGoldPrices());

  const hasChanges = useMemo(() => {
    return prices.some((currentPrice, index) => {
      const initialPrice = initialPrices[index];
      return currentPrice.pricePerGram !== initialPrice?.pricePerGram;
    });
  }, [prices, initialPrices]);

  const anyPriceHasNoValue = prices.some((price) => price.pricePerGram == null);

  const handlePriceChange = (karatType: KaratType, value: number | null) => {
    setPrices((prev) =>
      prev.map((price) =>
        price.karatType === karatType ? { ...price, pricePerGram: value } : price
      )
    );
  };

  const { data: pricingSettings } = useLocalApi({
    apiToCall: () => getPricingSettings(),
  }) as {
    data: (PriceItem & { stockWeight: number })[];
  };

  useEffect(() => {
    if (pricingSettings && pricingSettings.length > 0) {
      const goldSettings = pricingSettings.filter(
        (setting) => setting.productType === ProductType.Gold
      );
      const newPrices = emptyGoldPrices().map((defaultPrice) => {
        const match = goldSettings.find(
          (setting) => setting.karatType === defaultPrice.karatType
        );
        return match ?? defaultPrice;
      });
      setPrices(newPrices);
      setInitialPrices(newPrices);
    }
  }, [pricingSettings]);

  const stockByKarat: Record<number, number> = useMemo(() => {
    const map: Record<number, number> = {};
    (pricingSettings ?? [])
      .filter((setting) => setting.productType === ProductType.Gold)
      .forEach((setting) => {
        map[setting.karatType] = setting.stockWeight;
      });
    return map;
  }, [pricingSettings]);

  const karatCards = useMemo(
    () => buildKaratCards(prices, initialPrices, stockByKarat),
    [prices, initialPrices, stockByKarat]
  );

  const totalImpact = karatCards.reduce((sum, card) => sum + card.valueImpact, 0);
  const changedCount = karatCards.filter((card) => card.changed).length;
  const currentStockValue = computeTotalStockValue(initialPrices, stockByKarat);

  const handleApplyPrices = () => {
    const payload = { pricingSettings: prices };
    editPricingSettings(payload)
      .then((response) => {
        if (checkRequestSucceeded(response.statusCode)) {
          showSuccess(response?.message);
          setInitialPrices(prices);
        } else {
          showError(response?.message);
        }
      })
      .catch((e) => {
        throw e;
      });
  };

  return (
    <div id="pricing" className="page">
      <div className="pricing-inner">
        <div className="page-header">
          <h1 className="page-title">
            <FaTag className="icon" />
            <span>Gold pricing</span>
          </h1>
          <div className="page-actions">
            <button
              className={`btn-md ${hasChanges ? "btn-gold" : ""}`}
              onClick={handleApplyPrices}
              disabled={!hasChanges || anyPriceHasNoValue}
            >
              <FaSyncAlt />
              {hasChanges
                ? `Apply ${changedCount} change${changedCount !== 1 ? "s" : ""}`
                : "No changes"}
            </button>
          </div>
        </div>

        <div className="panel">
          <div className="price-grid">
            {karatCards.map((card) => (
              <KaratPriceCard
                key={card.karatType}
                karatLabel={card.karatLabel}
                stockGrams={card.stockGrams}
                price={card.price}
                changed={card.changed}
                deltaDirection={card.deltaDirection}
                deltaText={card.deltaText}
                onChange={(value) => handlePriceChange(card.karatType, value)}
              />
            ))}
          </div>

          {hasChanges && (
            <div className="impact-box">
              Applying these prices revalues your stock by{" "}
              <b>
                {totalImpact >= 0 ? "+" : "−"}
                {fmtCurrency(Math.abs(totalImpact))}
              </b>{" "}
              ({fmtCurrency(currentStockValue)} →{" "}
              <b>{fmtCurrency(currentStockValue + totalImpact)}</b>). POS
              prices update immediately.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
