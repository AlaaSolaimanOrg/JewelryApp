// CustomTable.tsx

import CustomLoader from "../../CustomLoader/CustomLoader";
import "./customTable.scss";

type TableRow = Record<
  string,
  string | number | React.ReactNode | null | undefined
>;

export type TableHeader = {
  key: string;
  label: React.ReactNode;
  width?: string;
  sortable?: boolean;
  onHeaderClick?: () => void;
};

type CustomTableProps = {
  headers: TableHeader[];
  data: TableRow[];
  isLoading?: boolean;
};

const CustomTable: React.FC<CustomTableProps> = ({
  headers,
  data,
  isLoading = false,
}) => {
  return (
    <div className="customTable">
      <table>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                style={{ width: header.width }}
                onClick={() => {
                  header.onHeaderClick?.();
                }}
              >
                {header.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={headers.length}>
                <CustomLoader />
              </td>
            </tr>
          ) : data?.length ? (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={
                  typeof row.rowClassName === "string"
                    ? row.rowClassName
                    : undefined
                }
              >
                {headers.map((header, colIndex) => (
                  <td key={colIndex}>{row[header.key] ?? null}</td>
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
