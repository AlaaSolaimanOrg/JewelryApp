import { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { flushSync } from "react-dom";
import {
  FaGlobe,
  FaInstagram,
  FaPrint,
  FaReceipt,
  FaTiktok,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { createReceiptPrintJob } from "../../../apis/printJobs.api/printJobs.api";
import { getRepairById } from "../../../apis/repairs.api/repairs.api";
import ADI_Jewelry_Logo_Horizontal from "../../../assets/images/ADI_Jewelry_Logo_Horizontal.avif";
import useLocalApi from "../../../hooks/useLocalApi";
import { serializeReceiptHtml } from "../../../services/serializeReceiptHtml";
import "./repairInvoiceModal.scss";

interface RepairInvoiceModalProps {
  repairId: string;
  show: boolean;
  onClose: () => void;
}

interface RepairDetails {
  id: string;
  repairCode: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  orderDate: string;
  status: number;
  notes: string;
  cost: number;
  depositPaid: number;
  paymentStatus: number;
  dueDate: string;
  slotNumber?: number | null;
}

const RepairInvoiceModal = ({
  repairId,
  show,
  onClose,
}: RepairInvoiceModalProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [epsonBusy, setEpsonBusy] = useState(false);
  const [showThermalPrint, setShowThermalPrint] = useState(false);

  const { data: repairDetails } = useLocalApi({
    apiToCall: (data) => getRepairById(data.payload),
    payload: { id: repairId },
    extraEffectCheck: !!repairId && !!show,
    effectDependency: [repairId, show],
  }) as { data: RepairDetails };

  const handleEpsonPrintHTML = async () => {
    flushSync(() => setShowThermalPrint(true));
    setEpsonBusy(true);
    try {
      if (!contentRef.current) {
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
      console.error(e);
      alert(String(e));
    } finally {
      flushSync(() => setShowThermalPrint(false));
      setEpsonBusy(false);
    }
  };

  if (!show) return null;

  const dateObj = repairDetails
    ? new Date(repairDetails?.orderDate)
    : new Date();

  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      size="lg"
      className="receipt-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <FaReceipt style={{ marginRight: 8 }} /> Repair Invoice
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {!repairDetails ? (
          <div className="text-center py-4">Loading repair details...</div>
        ) : (
          <div
            ref={contentRef}
            className={`receipt-container ${showThermalPrint ? "thermal-print" : ""}`}
          >
            {/* HEADER */}
            <div className="receipt-header">
              <div className="receipt-title">
                <div className="receipt-logo">
                  <img src={ADI_Jewelry_Logo_Horizontal} alt="Logo" />
                </div>
              </div>

              <div className="receipt-subtitle">
                6885 Ad Astra Blvd NW Edmonton, Alberta
              </div>
              <div className="receipt-subtitle">Phone: (780) 934-1455</div>
            </div>

            {/* DETAILS */}
            <div className="receipt-details">
              <div>
                <strong>Repair Code:</strong> {repairDetails?.repairCode}
                <br />
                <strong>Date:</strong> {dateObj.toLocaleDateString()}
              </div>

              <div>
                <strong>Customer:</strong> {repairDetails?.customerName}
                <br />
                <strong>Phone:</strong> {repairDetails?.customerPhone}
              </div>
            </div>

            {/* TOTAL & SLOT */}
            <div className="receipt-totals two-up">
              <div className="receipt-total">
                <div className="total-label">Cost</div>
                <div className="total-value">${repairDetails?.cost?.toFixed(2)}</div>
              </div>

              <div className="slot-box">
                <div className="slot-label">Slot</div>
                <div className="slot-value">{repairDetails?.slotNumber ?? "-"}</div>
              </div>
            </div>

            {/* FOOTER */}
            <div className="receipt-footer">
              <div className="social-links">
                <Link to="https://adijewelry.ca/" target="_blank">
                  <div className="social-item">
                    <FaGlobe className="globe-icon" />
                    <span>adijewelry.ca</span>
                  </div>
                </Link>

                <Link
                  to="https://www.instagram.com/adijewelry.ca?igsh=MTlzaTQ3Z2l0a3Axcw=="
                  target="_blank"
                >
                  <div className="social-item">
                    <FaInstagram className="instagram-icon" />
                    <span>@adijewelry.ca</span>
                  </div>
                </Link>
                <Link
                  to="https://www.tiktok.com/@adi_jewellery"
                  target="_blank"
                >
                  <div className="social-item">
                    <FaTiktok className="tiktok-icon" />
                    <span>@adi_jewellery</span>
                  </div>
                </Link>
              </div>

              <div className="qr-section">
                <div className="qr-label">Scan to leave a review</div>
                <QRCode
                  value="https://share.google/gxvrM3GV4YzjE232x"
                  size={showThermalPrint ? 64 : 80}
                  bgColor="#ffffff"
                  fgColor={showThermalPrint ? "#000000" : "var(--gold)"}
                  style={
                    showThermalPrint
                      ? { display: "block" }
                      : {
                          border: "1px solid #eee",
                          padding: "4px",
                          display: "block",
                        }
                  }
                />
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          variant="primary"
          onClick={handleEpsonPrintHTML}
          disabled={!repairDetails || epsonBusy}
        >
          <FaPrint /> {epsonBusy ? "Printing..." : "Print Invoice"}
        </Button>

        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RepairInvoiceModal;
