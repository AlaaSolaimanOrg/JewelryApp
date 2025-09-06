// CustomTable.tsx
import "./customTable.scss";
type TableRow = Record<
  string,
  string | number | React.ReactNode | null | undefined
>;

type CustomTableProps = {
  headers: string[];
  data: TableRow[]; // array of objects
};

const CustomTable: React.FC<CustomTableProps> = ({ headers, data }) => {
  return (
    <div className="customTable">
      <table>
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {headers.map((header, colIndex) => (
                <td key={colIndex}>
                  {row[header.replace(/\s/g, "")] ?? row[header]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
