// CustomTable.tsx
import React from "react";
import "./customTable.scss";

type TableRow = Record<
  string,
  string | number | React.ReactNode | null | undefined
>;

export type TableHeader = {
  key: string;
  label: string;
  width?: string;
};

type CustomTableProps = {
  headers: TableHeader[];
  data: TableRow[];
};

const CustomTable: React.FC<CustomTableProps> = ({ headers, data }) => {
  return (
    <div className="customTable">
      <table>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i} style={{ width: header.width }}>
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data?.length ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>
                    {row[header.key] ?? row[header.label.replace(/\s/g, "")]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr className="noResultsFound">
              <td colSpan={headers.length}>No results found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
