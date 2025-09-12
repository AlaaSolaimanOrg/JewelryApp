import { Col, Row } from "react-bootstrap";
import "./paginator.scss";

const Paginator = ({
  totalRecords,
  pageSize,
  pageNumber,
  onPaginationChange,
  maxPages = 5,
  marginTop = "62px",
}) => {
  if (!totalRecords || !pageSize) return null;

  const totalPages = Math.ceil(totalRecords / pageSize);

  const getPageNumbers = () => {
    let startPage = Math.max(pageNumber - Math.floor(maxPages / 2), 1);
    let endPage = startPage + maxPages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPages + 1, 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageClick = (newPageNumber) => {
    if (onPaginationChange) {
      onPaginationChange(newPageNumber);
    }
  };

  return (
    <Row className="paginator" style={{ marginTop }}>
      <Col md={12}>
        <div className="pagination">
          <button
            className="page-item"
            disabled={pageNumber === 1}
            onClick={() => handlePageClick(pageNumber - 1)}
          >
            Prev
          </button>

          {getPageNumbers().map((page) => (
            <div
              key={page}
              className={`page-item ${page === pageNumber ? "active" : ""}`}
              onClick={() => handlePageClick(page)}
            >
              {page}
            </div>
          ))}

          <button
            className="page-item"
            disabled={pageNumber === totalPages}
            onClick={() => handlePageClick(pageNumber + 1)}
          >
            Next
          </button>
        </div>
      </Col>
    </Row>
  );
};

export default Paginator;
