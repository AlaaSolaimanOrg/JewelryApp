import { FaShoppingCart } from "react-icons/fa";
import Paginator from "../../../../components/Paginator/Paginator";
import useLocalApiSearchSortPagination from "../../../../hooks/useLocalApiSearchSortPagination";
import { getSoldItems } from "../../../../apis/sales.api/sales.api";
import "./itemsSoldTo.scss"

interface SoldItem {
  productName: string;
  quantity: number;
  unitWeight: number;
  weightSummed: number;
  pricePerGram: number;
  subtotal: number;
  latestSaleDate: Date;
}

const ItemsSoldTo = () => {
  const {
    data: soldItems,
    onPaginationChange,
    pagination,
  } = useLocalApiSearchSortPagination<SoldItem>({
    apiToCall: (data) => getSoldItems(data.payload),
    initialPageSize: 5,
  });

  return (
    <section id="itemsSoldTo">
      <h2 className="section-title">
        <FaShoppingCart className="icon" style={{ marginRight: "8px" }} /> Items
        Sold
      </h2>
      <div className="filter-section">
        <select className="filter-select">
          <option>All Products</option>
          <option>Rings</option>
          <option>Necklaces</option>
          <option>Bracelets</option>
          <option>Earrings</option>
        </select>
        <select className="filter-select">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last 3 Months</option>
        </select>
        <select className="filter-select">
          <option>All Karats</option>
          <option>24K</option>
          <option>22K</option>
          <option>21K</option>
          <option>18K</option>
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Weight</th>
              <th>Price per Gram</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {pagination.totalRecords ? (
              soldItems.map((soldItem) => {
                return (
                  <tr>
                    <td>{soldItem.productName}</td>
                    <td>3</td>
                    <td>{soldItem.weightSummed}</td>
                    <td>{soldItem.pricePerGram}</td>
                    <td>{soldItem.subtotal}</td>
                  </tr>
                );
              })
            ) : (
              <tr className="noResultsFound">
                <td colSpan={5}>No results found</td>
              </tr>
            )}

            {/* <tr className="highlight">
                <td>
                  <strong>Total</strong>
                </td>
                <td>
                  <strong>10</strong>
                </td>
                <td>
                  <strong>21.0g</strong>
                </td>
                <td></td>
                <td></td>
                <td>
                  <strong>$2,646.10</strong>
                </td>
              </tr> */}
          </tbody>
        </table>
      </div>

      <Paginator
        totalRecords={pagination.totalRecords}
        pageNumber={pagination.pageNumber}
        pageSize={pagination.pageSize}
        onPaginationChange={onPaginationChange}
      />
    </section>
  );
};

export default ItemsSoldTo;
