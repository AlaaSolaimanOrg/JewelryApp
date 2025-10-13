import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { SortDirection } from "../types/enums";
import type { SortCriteria } from "../types/general";
import { checkRequestSucceeded, debounce, showError } from "../utils";

type ApiSortSearchPropsType<T> = {
  extraPayload?: any;
  extraEffectCheck?: boolean;
  extraEffectDependency?: any[];
  extractFromResponse?: string[];
  apiToCall: (data: any) => Promise<any>;
  apiName?: string;
  finallyCallback?: () => void;
  initialSortBy?: string;
  initialSortDirection?: SortDirection;
  initialPageSize?: number;
  showErrorAlert?: boolean;
};

const useLocalApiSearchSortPagination = <T = any>({
  extraPayload = {},
  extractFromResponse = [],
  extraEffectCheck = true,
  extraEffectDependency = [],
  finallyCallback = () => {},
  initialSortBy = "",
  initialSortDirection = SortDirection.Ascending,
  initialPageSize = 10,
  showErrorAlert = true,
  apiToCall,
  apiName,
}: ApiSortSearchPropsType<T>) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState<{
    pageSize: number;
    pageNumber: number;
    totalRecords: number;
  }>({ pageSize: initialPageSize, pageNumber: 1, totalRecords: 0 });

  const [sortCriteria, setSortCriteria] = useState<SortCriteria>({
    sortDirection: initialSortDirection,
    sortBy: initialSortBy,
  });

  const [searchBy, setSearchBy] = useState<string>("");
  const [data, setData] = useState<T[]>([]);
  const [dataExtractedFromResponse, setDataExtractedFromResponse] =
    useState<any>(null);

  const componentMounted = useRef(false);

  useEffect(() => {
    if (extraEffectCheck) fetchData();
  }, [
    pagination.pageNumber,
    pagination.pageSize,
    sortCriteria,
    ...extraEffectDependency,
  ]);

  useEffect(() => {
    if (componentMounted.current) {
      if (pagination.pageNumber === 1) {
        if (extraEffectCheck) fetchData();
      }
      onPaginationChange(1);
    }
  }, [searchBy]);

  useEffect(() => {
    componentMounted.current = true;
    return () => {
      componentMounted.current = false;
    };
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    const { pageSize, pageNumber } = pagination;
    const { sortBy, sortDirection } = sortCriteria;

    const requestData = {
      payload: {
        ...extraPayload,
        pageSize: pageSize,
        pageNumber: pageNumber,
        searchBy: searchBy?.trim(),
        sortDirection,
        sortBy: sortBy,
      },
      apiName,
    };

    try {
      const response = await apiToCall(requestData);
      console.log("response", response);
      const { data: responseData, message, totalRecords, pageSize } = response;

      processErrorResponse(response, message);

      setPagination((prev) => ({
        ...prev,
        totalRecords: response.statusCode == 204 ? 0 : totalRecords,
        pageSize: response.statusCode == 204 ? pagination.pageSize : pageSize,
      }));

      setData(responseData);
      if (extractFromResponse?.length) {
        const finalData = {};
        for (const property of extractFromResponse) {
          if (response[property]) finalData[property] = response[property];
        }
        setDataExtractedFromResponse(finalData);
      }
    } catch (error: any) {
      showError(error?.message);

      console.error(error?.message);
    } finally {
      setIsLoading(false);
      finallyCallback();
    }
  };

  const onSearchChange = debounce((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.value?.length || event.target.value?.length === 0) {
      setSearchBy(event.target.value);
    }
  }, 700);

  const onPaginationChange = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, pageNumber }));
  };

  const onPageSizeChange = debounce((pageSize) => {
    const newPageSize = Number(pageSize);

    setPagination((prev) => ({
      ...prev,
      pageSize: newPageSize,
      pageNumber: 1,
    }));
  }, 300);

  const onSortChange = (sortBy: string, value?: SortDirection) => {
    setPagination((prev) => ({ ...prev, pageNumber: 1 }));
    setSortCriteria({ sortBy, sortDirection: value });
  };

  const processErrorResponse = (response, message) => {
    if (!checkRequestSucceeded(response.statusCode)) {
      if (showErrorAlert && message) showError(message);
      console.error(message);
    }
  };

  const resetFilters = () => {
    setPagination({
      pageSize: initialPageSize,
      pageNumber: 1,
      totalRecords: 0,
    });
    setSortCriteria({
      sortDirection: initialSortDirection,
      sortBy: initialSortBy,
    });
    setSearchBy("");
  };
  return {
    dataExtractedFromResponse,
    onPaginationChange,
    onSearchChange,
    onSortChange,
    onPageSizeChange,
    searchBy,
    pagination,
    isLoading,
    data,
    sortCriteria,
    setData,
    fetchData,
    resetFilters,
  };
};

export default useLocalApiSearchSortPagination;
