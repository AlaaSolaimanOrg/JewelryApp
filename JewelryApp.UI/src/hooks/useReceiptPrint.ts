import { useState } from "react";
import { flushSync } from "react-dom";
import type { RefObject } from "react";
import { createReceiptPrintJob } from "../apis/printJobs.api/printJobs.api";
import { serializeReceiptHtml } from "../services/serializeReceiptHtml";

export function useReceiptPrint(
  contentRef: RefObject<HTMLDivElement | null>,
  saleDetails: object | null | undefined,
  initialShowThermal = false,
) {
  const [epsonBusy, setEpsonBusy] = useState(false);
  const [showThermalPrint, setShowThermalPrint] = useState(initialShowThermal);
  const [isGiftReceipt, setIsGiftReceipt] = useState(false);

  const handleEpsonPrintHTML = async () => {
    flushSync(() => setShowThermalPrint(true));
    setEpsonBusy(true);
    try {
      if (!saleDetails || !contentRef.current) {
        return;
      }

      const html = await serializeReceiptHtml(contentRef.current);

      await createReceiptPrintJob({
        storeId: "store-1",
        printerId: "front-desk",
        receiptPayload: { html },
      });

      console.log("✅ Print job queued successfully");
    } catch (e) {
      console.error("❌ Print error:", e);
      alert(String(e));
    } finally {
      flushSync(() => setShowThermalPrint(false));
      setEpsonBusy(false);
    }
  };

  return { epsonBusy, showThermalPrint, isGiftReceipt, setIsGiftReceipt, handleEpsonPrintHTML };
}
