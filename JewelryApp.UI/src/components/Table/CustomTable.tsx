import "./customTable.scss";

const CustomTable = () => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Karat</th>
            <th>Units Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Diamond Engagement Ring</td>
            <td>Rings</td>
            <td>18K</td>
            <td>24</td>
            <td>$12,450</td>
          </tr>
          <tr>
            <td>Gold Bangle Set</td>
            <td>Bangles</td>
            <td>22K</td>
            <td>18</td>
            <td>$8,250</td>
          </tr>
          <tr>
            <td>Sapphire Pendant</td>
            <td>Necklaces</td>
            <td>21K</td>
            <td>15</td>
            <td>$7,890</td>
          </tr>
          <tr>
            <td>Emerald Earrings</td>
            <td>Earrings</td>
            <td>18K</td>
            <td>12</td>
            <td>$5,670</td>
          </tr>
          <tr>
            <td>Platinum Wedding Band</td>
            <td>Rings</td>
            <td>Platinum</td>
            <td>10</td>
            <td>$4,320</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CustomTable;
