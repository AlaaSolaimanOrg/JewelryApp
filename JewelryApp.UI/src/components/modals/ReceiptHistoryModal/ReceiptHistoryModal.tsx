import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { FaReceipt } from "react-icons/fa";
import "./receiptHistoryModal.scss";
import type { TableHeader } from "../../Table/CustomTable";
import CustomTable from "../../Table/CustomTable";
import ReceiptModal from "../ReceiptModal/ReceiptModal";
import { getCustomerPurhcaseHistory } from "../../../apis/customers.api/customers.api";
import useLocalApi from "../../../hooks/useLocalApi";

interface PurchaseHistory {
  saleId: string;
  purchaseDate: string;
  totalAmount: number;
}

interface ReceiptHistoryModalProps {
  customerId: string;
  children: React.ReactNode;
}

const ReceiptHistoryModal = ({
  customerId,
  children,
}: ReceiptHistoryModalProps) => {
  const [showModal, setShowModal] = useState(false);

  console.log("customerId", customerId);
  const { data: customerPurhcaseHistory } = useLocalApi({
    apiToCall: (data) => getCustomerPurhcaseHistory(data.payload),
    payload: { customerId: customerId },
    extraEffectCheck: !!showModal,
    effectDependency: [showModal],
  }) as {
    data: PurchaseHistory[];
    fetchData: () => void;
  };

  const onClose = () => {
    setShowModal(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Define table headers
  const headers: TableHeader[] = [
    {
      key: "purchaseDate",
      label: "Purchase Date",
      width: "40%",
      sortable: true,
      onHeaderClick: () => console.log("Sort by date"), // Add your sort logic here
    },
    {
      key: "amount",
      label: "Amount",
      width: "30%",
      sortable: true,
      onHeaderClick: () => console.log("Sort by amount"), // Add your sort logic here
    },
    {
      key: "actions",
      label: "View Receipt",
      width: "30%",
      sortable: false,
    },
  ];

  // Transform sales data for the table
  const tableData = customerPurhcaseHistory.map((purhcaseHistory) => ({
    purchaseDate: formatDate(purhcaseHistory.purchaseDate),
    amount: formatCurrency(purhcaseHistory.totalAmount),
    actions: (
      <ReceiptModal saleId={purhcaseHistory.saleId}>
        <button className="view-receipt-btn">View Receipt</button>
      </ReceiptModal>
    ),
  }));

  return (
    <div>
      <div onClick={() => setShowModal(true)} style={{ cursor: "pointer" }}>
        {children}
      </div>

      <Modal
        show={showModal}
        onHide={onClose}
        centered
        size="lg"
        className="receipt-history-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FaReceipt style={{ marginRight: "8px" }} /> Purchase History
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <div className="receipt-history-container">
            {customerPurhcaseHistory.length === 0 ? (
              <div className="text-center py-4">
                <p>No purchase history found.</p>
              </div>
            ) : (
              <CustomTable
                headers={headers}
                data={tableData}
                isLoading={false}
              />
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReceiptHistoryModal;
