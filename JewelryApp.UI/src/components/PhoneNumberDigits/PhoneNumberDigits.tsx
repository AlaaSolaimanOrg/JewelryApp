import React, { useEffect, useRef, useState } from "react";
import "./phoneNumberDigits.scss";

interface Props {
  value: string; // normalized digits-only 0-9 string (expected up to 10 digits)
  onChange: (v: string) => void;
  disabled?: boolean;
  error?: string | null;
}

const PhoneNumberDigits: React.FC<Props> = ({ value, onChange, disabled = false, error }) => {
  const [digits, setDigits] = useState<string[]>(() => new Array(10).fill(""));
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    const chars = (value || "").replace(/\D/g, "").split("");
    const next = new Array(10).fill("");
    chars.forEach((c, i) => {
      if (i < 10) next[i] = c;
    });
    // Avoid resetting state if digits already match to prevent flicker when typing fast
    if (next.join("") !== digits.join("")) {
      setDigits(next);
    }
  }, [value]);

  useEffect(() => {
    onChange(digits.join(""));
  }, [digits]);

  const handleChange = (index: number, v: string) => {
    if (disabled) return;
    const d = v.replace(/\D/g, "").slice(0, 1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = d;
      return next;
    });
    if (d && index < 9) {
      // Delay focus so DOM updates complete and avoid input flicker
      setTimeout(() => refs.current[index + 1]?.focus(), 0);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    const key = e.key;
    if (key === "Backspace") {
      if (!digits[index] && index > 0) {
        setTimeout(() => refs.current[index - 1]?.focus(), 0);
      } else {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      }
    }
    if (key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus();
    if (key === "ArrowRight" && index < 9) refs.current[index + 1]?.focus();
  };

  return (
    <div className={`phone-digits-component ${error ? "invalid" : ""}`}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          className="digit-box"
          value={d}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          disabled={disabled}
        />
      ))}
    </div>
  );
};

export default PhoneNumberDigits;
