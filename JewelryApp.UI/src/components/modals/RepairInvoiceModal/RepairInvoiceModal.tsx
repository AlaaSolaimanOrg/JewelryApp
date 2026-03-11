import { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import {
  FaGlobe,
  FaInstagram,
  FaPrint,
  FaReceipt,
  FaTiktok,
} from "react-icons/fa";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { getRepairById } from "../../../apis/repairs.api/repairs.api";
import ADI_Jewelry_Logo_Horizontal from "../../../assets/images/ADI_Jewelry_Logo_Horizontal.avif";
import ADI_Jewelry_Logo_Horizontal_Black from "../../../assets/images/Adi_Jewelry_Logo_Black.png";
import useLocalApi from "../../../hooks/useLocalApi";
import {
  ProductCategory,
  RepairType,
  PaymentStatus,
} from "../../../types/enums";
import { splitCamelCaseWords } from "../../../utils";
import { printDomToEpson } from "../../../EpsonDomPrintOptions.ts";
import "./repairInvoiceModal.scss";

interface RepairInvoiceModalProps {
  repairId: string;
  show: boolean;
  onClose: () => void;
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
  }) as { data: any };

  const handleEpsonPrintHTML = async () => {
    if (!contentRef.current) return;

    setShowThermalPrint(true);
    setEpsonBusy(true);
    try {
      await new Promise((resolve) =>
        requestAnimationFrame(() => resolve(null)),
      );
      await printDomToEpson(contentRef.current, {
        ip: "192.168.0.19",
        port: 8043,
        crypto: true,
        buffer: false,
        paperWidthPx: 576,
        scale: 4,
      });
     console.log("✅ Print job sent successfully");
    } catch (e) {
      console.error("❌ Print error:", e);
      console.error(e);
      alert(String(e));
    } finally {
      setShowThermalPrint(false);
      setEpsonBusy(false);
    }
  };

  if (!show) return null;

  const dateObj = repairDetails
    ? new Date(repairDetails?.orderDate)
    : new Date();

  const totalBeforeDiscount = repairDetails
    ? (repairDetails?.items?.reduce(
        (s: number, x: any) => s + (x.subtotal ?? x.cost ?? 0),
        0,
      ) ?? 0)
    : 0;

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
                  <img
                    src={
                      showThermalPrint
                        ? ADI_Jewelry_Logo_Horizontal_Black
                        : ADI_Jewelry_Logo_Horizontal
                    }
                    alt="Logo"
                  />
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

            {/* TABLE */}
            <div className="table-wrapper">
              <table className="receipt-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Repair</th>
                    <th>Weight</th>
                    <th>Payment</th>
                    <th>Cost</th>
                  </tr>
                </thead>

                <tbody className="table-body-scrollable">
                  {repairDetails?.items?.map((i: any) => (
                    <tr key={i.id}>
                      <td>
                        {splitCamelCaseWords(ProductCategory[i.itemType])}
                      </td>
                      <td>{splitCamelCaseWords(RepairType[i.repairType])}</td>
                      <td>{i.weight}g</td>
                      <td>
                        <span
                          className={
                            i.paymentStatus === PaymentStatus.Paid
                              ? "payment-badge payment-paid"
                              : "payment-badge payment-unpaid"
                          }
                        >
                          {i.paymentStatus === PaymentStatus.Paid
                            ? "Paid"
                            : "Unpaid"}
                        </span>
                      </td>
                      <td>${i.cost?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAYMENT BREAKDOWN */}
            <div className="payment-breakdown">
              <h4>Payment Breakdown</h4>

              <div className="summary-item">
                <span>Total Before Discount:</span>
                <span>${totalBeforeDiscount?.toFixed(2)}</span>
              </div>

              {repairDetails?.items?.some((x: any) => x.depositPaid > 0) && (
                <div className="summary-item">
                  <span>Total Deposits Paid:</span>
                  <span>
                    $
                    {repairDetails?.items
                      ?.reduce((s: number, x: any) => s + x.depositPaid, 0)
                      ?.toFixed(2)}
                  </span>
                </div>
              )}

              <div className="summary-item">
                <span>Total Cost:</span>
                <span>${repairDetails?.totalCost?.toFixed(2)}</span>
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
