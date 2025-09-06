import "./customTable.scss";

type CustomTableProps = {
  headers: string[];
  data: any;
};

const CustomTable: React.FC<CustomTableProps> = ({ headers, data }) => {
  return (
    <div className="table-container">
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
              {headers.map((_, colIndex) => (
                <td key={colIndex}>{row[colIndex]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
