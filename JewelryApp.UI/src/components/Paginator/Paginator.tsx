import type { ChangeEvent } from "react";
import { Col, Row } from "react-bootstrap";
import "./paginator.scss";

type PaginatorProps = {
  totalRecords: number;
  pageSize: number;
  pageNumber: number;
  onPaginationChange?: (pageNumber: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  maxPages?: number;
  marginTop?: string;
};

const Paginator = ({
  totalRecords,
  pageSize,
  pageNumber,
  onPaginationChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  maxPages = 5,
  marginTop = "62px",
}: PaginatorProps) => {
  if (!totalRecords || !pageSize) return null;

  const totalPages = Math.ceil(totalRecords / pageSize);
  const availablePageSizes = pageSizeOptions.includes(pageSize)
    ? pageSizeOptions
    : [...pageSizeOptions, pageSize].sort((a, b) => a - b);

  const getPageNumbers = () => {
    let startPage = Math.max(pageNumber - Math.floor(maxPages / 2), 1);
    let endPage = startPage + maxPages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPages + 1, 1);
    }

    const pages = [] as any;
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

  const handlePageSizeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (onPageSizeChange) {
      onPageSizeChange(Number(event.target.value));
    }
  };

  return (
    <Row className="paginator" style={{ marginTop }}>
      <Col md={12}>
        <div className="paginator-controls">
          {onPageSizeChange && (
            <div className="page-size-control">
              <span>Page size</span>
              <select value={pageSize} onChange={handlePageSizeChange}>
                {availablePageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

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
        </div>
      </Col>
    </Row>
  );
};

export default Paginator;
