import { FaDownload } from "react-icons/fa";
import { getTopSellingCategories } from "../../../../apis/sales.api/sales.api";

import useLocalApi from "../../../../hooks/useLocalApi";
import type { KaratType } from "../../../../types/enums";
import type { TableHeader } from "../../../../components/tables/Table/CustomTable";
import CustomTable from "../../../../components/tables/Table/CustomTable";

interface TopSellingCategory {
  categoryName: string;
  karat: KaratType;
  itemsSold: number;
  revenue: number;
  percentageOfTotal: number;
}

const TopSellingCategories = () => {
  const { data: topSellingCategories, isLoading } = useLocalApi({
    apiToCall: () => getTopSellingCategories(),
    payload: {
      topCount: 5,
    },
  }) as {
    data: TopSellingCategory[];
    isLoading: boolean;
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
      <CustomTable headers={headers} data={tableData} isLoading={isLoading} />
    </div>
  );
};

export default TopSellingCategories;
