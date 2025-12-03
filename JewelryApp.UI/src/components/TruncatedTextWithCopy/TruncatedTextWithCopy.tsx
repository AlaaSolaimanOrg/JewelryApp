import { useState } from "react";

// Utility component for truncated text with copy on click
const TruncatedTextWithCopy = ({
  text,
  maxLength = 12,
}: {
  text: string;
  maxLength?: number;
}) => {
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const isTruncated = text.length > maxLength;
  const displayText = isTruncated ? text.substring(0, maxLength) + "..." : text;

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="truncated-text-wrapper">
      <span
        className="truncated-text"
        onClick={handleCopy}
        onMouseEnter={() => isTruncated && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        data-tooltip={isTruncated ? text : undefined}
      >
        {displayText}
        {copied && <span className="copy-feedback">✓</span>}
      </span>
      {showTooltip && isTruncated && (
        <div className="custom-tooltip">{text}</div>
      )}
    </div>
  );
};
export default TruncatedTextWithCopy;
