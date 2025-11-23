import React, { useState } from "react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "./customTableWithAccordion.scss";

export interface Column<T> {
  label: string;
  accessor?: keyof T | string;
  render?: (row: T) => React.ReactNode;
  width?: string;
  align?: "left" | "center" | "right";
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  rowKey: keyof T;
  renderAccordion: (row: T) => React.ReactNode;
  emptyMessage?: string;
}

const CustomTableWithAccordion = <T,>({
  data,
  columns,
  rowKey,
  renderAccordion,
  emptyMessage = "No records found.",
}: Props<T>) => {
  const [expanded, setExpanded] = useState<Array<string | number>>([]);

  const toggle = (id: string | number) => {
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="custom-table-container">
      <table className="custom-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.label}
                style={{ width: col.width, textAlign: col.align ?? "left" }}
              >
                {col.label}
              </th>
            ))}
            <th style={{ textAlign: "right" }}>More</th>
          </tr>
        </thead>

        <tbody>
          {data.map((row) => {
            const key = row[rowKey] as unknown as string | number;
            const isOpen = expanded.includes(key);

            return (
              <React.Fragment key={key}>
                {/* MAIN ROW */}
                <tr className="main-row">
                  {columns.map((col) => (
                    <td key={String(col.accessor)} style={{ textAlign: col.align ?? "left" }}>
                      {col.render ? col.render(row) : (row as any)[col.accessor]}
                    </td>
                  ))}

                  {/* Expand button */}
                  <td style={{ textAlign: "right" }}>
                    <button className="expand-btn" onClick={() => toggle(key)}>
                      {isOpen ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
                    </button>
                  </td>
                </tr>

                {/* ACCORDION ROW */}
                {isOpen && (
                  <tr className="subrow-wrapper">
                    <td colSpan={columns.length + 1}>
                      <div className="accordion-wrapper">{renderAccordion(row)}</div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}

          {/* EMPTY STATE */}
          {data.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="empty-state">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTableWithAccordion;
