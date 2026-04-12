import { useRef, useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { FaPrint, FaReceipt } from "react-icons/fa";
import { getSaleById } from "../../../apis/sales.api/sales.api";
import useLocalApi from "../../../hooks/useLocalApi";
import { useReceiptPrint } from "../../../hooks/useReceiptPrint";
import ReceiptContent from "../../ReceiptContent/ReceiptContent";
import type { Sale } from "../../ReceiptContent/ReceiptContent";
import "./receiptModal.scss";

interface ReceiptModalProps {
  saleId: string;
  children: React.ReactNode;
}

const ReceiptModal = ({ saleId, children }: ReceiptModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: saleDetails } = useLocalApi({
    apiToCall: (data) => getSaleById(data.payload),
    payload: { saleId },
    extraEffectCheck: !!saleId && !!showModal,
    effectDependency: [saleId, showModal],
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

  const onClose = () => {
    setShowModal(false);
  };
  return (
    <div>
      <div onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {children}
      </div>

      <Modal
        show={showModal}
        onHide={onClose}
        centered
        size="xl"
        className="receipt-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaReceipt style={{ marginRight: "8px" }} /> Receipt Preview
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {!saleDetails ? (
            <div className="text-center py-4">
              <p>Loading sale details...</p>
            </div>
          ) : (
            <ReceiptContent
              saleDetails={saleDetails}
              contentRef={contentRef}
              showThermalPrint={showThermalPrint}
              isGiftReceipt={isGiftReceipt}
              showReturnedColumn
            />
          )}
        </Modal.Body>

        <Modal.Footer>
          <div className="receipt-gift-toggle me-auto">
            <Form.Check
              type="switch"
              id={`gift-receipt-switch-${saleId}`}
              label="Gift receipt"
              checked={isGiftReceipt}
              onChange={(e) => setIsGiftReceipt(e.target.checked)}
            />
          </div>
          <Button
            variant="primary"
            onClick={handleEpsonPrintHTML}
            disabled={!saleDetails || epsonBusy}
          >
            <FaPrint /> {epsonBusy ? "Printing..." : "Print"}
          </Button>

          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceiptModal;
