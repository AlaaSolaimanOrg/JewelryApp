import { useRef } from "react";
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
import { useReactToPrint } from "react-to-print";
import { getRepairById } from "../../../apis/repairs.api/repairs.api";
import ADI_Jewelry_Logo_Horizontal from "../../../assets/images/ADI_Jewelry_Logo_Horizontal.avif";
import useLocalApi from "../../../hooks/useLocalApi";
import {
  ProductCategory,
  RepairType
} from "../../../types/enums";
import { splitCamelCaseWords } from "../../../utils";
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

  const { data: repairDetails } = useLocalApi({
    apiToCall: (data) => getRepairById(data.payload),
    payload: { id: repairId },
    extraEffectCheck: !!repairId && !!show,
    effectDependency: [repairId, show],
  }) as { data: any };

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: `Repair-${repairDetails?.repairCode || repairId}`,
  });

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
          <div ref={contentRef} className="receipt-container">
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

              <strong style={{ marginTop: 10, fontSize: "1.2rem" }}>
                Repair Invoice
              </strong>
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
                    <th>Cost</th>
                    <th>Urgent</th>
                    <th>Discount</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>

                <tbody className="table-body-scrollable">
                  {repairDetails?.items?.map((i: any) => (
                    <tr key={i.id}>
                      <td>
                        {splitCamelCaseWords(ProductCategory[i.itemType])}
                      </td>
                      <td>{splitCamelCaseWords(RepairType[i.repairType])}</td>
                      <td>${i.cost?.toFixed(2)}</td>
                      <td>${i.urgentFee?.toFixed(2)}</td>
                      <td>${i.discount?.toFixed(2)}</td>
                      <td>${i.subTotal?.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAYMENT BREAKDOWN */}
            <div className="payment-breakdown">
              <h4>Payment Breakdown</h4>

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
                  size={80}
                  bgColor="#ffffff"
                  fgColor="var(--gold)"
                  style={{ border: "1px solid #eee", padding: "4px" }}
                />
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={handlePrint} disabled={!repairDetails}>
          <FaPrint /> Print Invoice
        </Button>

        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default RepairInvoiceModal;
