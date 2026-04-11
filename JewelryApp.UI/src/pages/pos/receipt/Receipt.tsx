import { useRef } from "react";
import { FaCheck, FaPrint, FaReceipt } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { useReceiptPrint } from "../../../hooks/useReceiptPrint";
import "./receipt.scss";
import { Button, Form } from "react-bootstrap";
import ReceiptContent from "../../../components/ReceiptContent/ReceiptContent";
import type { Sale } from "../../../components/ReceiptContent/ReceiptContent";

const Receipt = () => {
  const { saleId } = useParams();
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: saleDetails } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { saleId },
    extraEffectCheck: !!saleId,
    effectDependency: [saleId],
  }) as {
    data: Sale;
    fetchData: () => void;
  };

  const {
    epsonBusy,
    showThermalPrint,
    isGiftReceipt,
    setIsGiftReceipt,
    handleEpsonPrintHTML,
  } = useReceiptPrint(contentRef, saleDetails, false);

  if (!saleDetails) {
    return (
      <div id="receipt-page" className="page-content">
        <h2>
          <FaReceipt /> Receipt Preview
        </h2>
        <p>Loading sale details...</p>
      </div>
    );
  }

  return (
    <div id="receipt-page" className="page-content">
      <h2 className="title">
        <FaReceipt /> Receipt Preview
      </h2>
      <p className="subtitle">Review receipt before finalizing</p>

      <ReceiptContent
        saleDetails={saleDetails}
        contentRef={contentRef}
        showThermalPrint={showThermalPrint}
        isGiftReceipt={isGiftReceipt}
      />

      <div className="receipt-actions">
        <div style={{ marginRight: 12 }}>
          <Form.Check
            type="switch"
            id={`gift-receipt-switch-${saleDetails.id}`}
            label="Gift receipt"
            checked={isGiftReceipt}
            onChange={(e) => setIsGiftReceipt(e.target.checked)}
          />
        </div>
        {/* <button className="btn btn-primary" onClick={handlePrint}>
            <FaPrint /> Print Receipt
          </button> */}

        <Button
          variant="primary"
          onClick={handleEpsonPrintHTML}
          disabled={!saleDetails || epsonBusy}
        >
          <FaPrint /> {epsonBusy ? "Printing..." : "Print"}
        </Button>

        <Link to={"/"} className="text-decoration-none">
          <button className="btn btn-secondary">
            <FaCheck /> Start New Sale
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Receipt;
