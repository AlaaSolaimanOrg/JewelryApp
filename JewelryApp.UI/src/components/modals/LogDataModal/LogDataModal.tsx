import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { FaCopy, FaCheck } from "react-icons/fa";
import "./logDataModal.scss";

interface LogDataModalProps {
  show: boolean;
  onHide: () => void;
  title: string;
  data: string;
}

const LogDataModal: React.FC<LogDataModalProps> = ({
  show,
  onHide,
  title,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(data);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="log-data-container">
          <div className="data-content">
            <pre>{data || "No data available"}</pre>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant={copied ? "success" : "outline-primary"}
          onClick={handleCopy}
          className="copy-btn"
        >
          {copied ? (
            <>
              <FaCheck className="me-2" />
              Copied!
            </>
          ) : (
            <>
              <FaCopy className="me-2" />
              Copy
            </>
          )}
        </Button>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LogDataModal;
