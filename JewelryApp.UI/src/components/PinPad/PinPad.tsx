import { useState } from "react";
import { FaBackspace } from "react-icons/fa";
import "./pinPad.scss";

const PIN_PAD_DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

interface PinPadProps {
  show: boolean;
  correctPin: string;
  title?: string;
  subtitle?: string;
  pinLength?: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const PinPad = ({
  show,
  correctPin,
  title = "Enter PIN",
  subtitle = "Enter 4-digit PIN",
  pinLength = 4,
  onSuccess,
  onCancel,
}: PinPadProps) => {
  const [entry, setEntry] = useState("");
  const [error, setError] = useState("");
  const [wrong, setWrong] = useState(false);

  const reset = () => {
    setEntry("");
    setError("");
    setWrong(false);
  };

  const handleCancel = () => {
    reset();
    onCancel();
  };

  const checkPin = (value: string) => {
    if (value === correctPin) {
      reset();
      onSuccess();
    } else {
      setWrong(true);
      setError("Wrong PIN");
      setTimeout(() => {
        setEntry("");
        setWrong(false);
      }, 500);
    }
  };

  const handleKey = (digit: string) => {
    if (entry.length >= pinLength) return;
    const next = entry + digit;
    setEntry(next);
    setError("");
    if (next.length === pinLength) setTimeout(() => checkPin(next), 200);
  };

  const handleDelete = () => {
    setEntry((prev) => prev.slice(0, -1));
    setError("");
  };

  return (
    <div className={`pin-overlay ${show ? "show" : ""}`}>
      <div className="pin-modal">
        <div className="pin-title">{title}</div>
        <div className="pin-sub">{subtitle}</div>
        <div className="pin-dots">
          {Array.from({ length: pinLength }).map((_, i) => (
            <div
              key={i}
              className={`pin-dot ${i < entry.length ? "filled" : ""} ${
                wrong ? "wrong" : ""
              }`}
            />
          ))}
        </div>
        <div className="pin-pad">
          {PIN_PAD_DIGITS.map((n) => (
            <div key={n} className="pin-key" onClick={() => handleKey(n)}>
              {n}
            </div>
          ))}
          <div className="pin-key empty" />
          <div className="pin-key" onClick={() => handleKey("0")}>
            0
          </div>
          <div className="pin-key del" onClick={handleDelete}>
            <FaBackspace />
          </div>
        </div>
        <div className="pin-error">{error}</div>
        <button className="pin-cancel" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PinPad;
