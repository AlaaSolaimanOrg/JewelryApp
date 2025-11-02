import { useEffect, useState } from "react";
import { checkRequestSucceeded } from "../utils";

type ApiSortSearchPropsType = {
  payload?: any;
  extraEffectCheck?: boolean;
  effectDependency?: any[];
  extractFromResponse?: string[];
  responseProperty?: string;
  apiToCall: (data: any) => any;
  dataInitalValue?: any;
  apiName?: string;
  finallyCallback?: () => void;
  initallyIsLoading?: boolean;
};

const useLocalApi = ({
  payload = {},
  extractFromResponse = [],
  extraEffectCheck = true,
  responseProperty = "",
  effectDependency = [],
  finallyCallback = () => {},
  dataInitalValue = [],
  apiToCall,
  apiName,
  initallyIsLoading = false,
}: ApiSortSearchPropsType) => {
  const [isLoading, setIsLoading] = useState<boolean>(initallyIsLoading);

  const [data, setData] = useState<any[] | any>(dataInitalValue);

  const [statusCode, setStatusCode] = useState<any[] | any>([]);
  const [dataExtractedFromResponse, setDataExtractedFromResponse] =
    useState<any>(null);

  useEffect(() => {
    if (extraEffectCheck) fetchData();
  }, [...effectDependency]);

  const fetchData = async () => {
    setIsLoading(true);
    setData(dataInitalValue);
    const requestData = {
      payload: {
        ...payload,
      },
      apiName,
    };
    try {
      const response = await apiToCall(requestData);
      const { data: responseData } = responseProperty
        ? response[responseProperty]
        : response;
      setStatusCode(response?.statusCode);

      if (!checkRequestSucceeded(response?.statusCode)) {
        // setError(message);
        return;
      }

      if (responseData) {
        setData(responseData);
      }
      if (extractFromResponse?.length) {
        const finalData = {};
        for (const property of extractFromResponse) {
          if (response[property]) finalData[property] = response[property];
        }
        setDataExtractedFromResponse(finalData);
      }
    } catch (error: any) {
      // if (setError) setError(e?.message);
    } finally {
      setIsLoading(false);
      finallyCallback();
    }
  };

  return {
    dataExtractedFromResponse,
    isLoading,
    data,
    setData,
    fetchData,
    statusCode,
  };
};

export default useLocalApi;
