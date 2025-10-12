import { FaDownload } from "react-icons/fa";
import { getTopSellingCategories } from "../../../../apis/sales.api/sales.api";
import CustomTable, {
  type TableHeader,
} from "../../../../components/Table/CustomTable";
import useLocalApi from "../../../../hooks/useLocalApi";
import type { KaratType } from "../../../../types/enums";

interface TopSellingCategory {
  categoryName: string;
  karat: KaratType;
  itemsSold: number;
  revenue: number;
  percentageOfTotal: number;
}

const TopSellingCategories = () => {
  const { data: topSellingCategories ,fetchData, recallGetTopCategories} = useLocalApi({
    apiToCall: (data) => getTopSellingCategories(data.payload),
    payload: {
      topCount: 5,
    },
  }) as {
    data: TopSellingCategory[];
    setData: any;
  };

  const headers: TableHeader[] = [
    { key: "categoryName", label: "Category", width: "150px" },
    { key: "karat", label: "Karat", width: "80px" },
    { key: "itemsSold", label: "Units Sold", width: "120px" },
    {
      key: "revenue",
      label: "Revenue",
      width: "150px",
    },
    {
      key: "percentageOfTotal",
      label: "% of Total",
      width: "120px",
    },
  ];

  // Transform API data to match table structure
  const tableData =
    topSellingCategories?.map((category: TopSellingCategory) => ({
      categoryName: category.categoryName,
      karat: category.karat,
      itemsSold: category.itemsSold,
      revenue: category.revenue,
      percentageOfTotal: category.percentageOfTotal,
    })) || [];

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Top Selling Categories</h3>
        <div className="temoporarylyHide">
          <button className="btn-md btn-gray">
            <FaDownload className="icon me-1" /> Export
          </button>
        </div>
      </div>
      <CustomTable
        headers={headers}
        data={tableData}
        emptyMessage="No top selling categories data available"
      />
    </div>
  );
};

export default TopSellingCategories;
