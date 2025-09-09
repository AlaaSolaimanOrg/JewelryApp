import { useEffect, useState } from "react";
import { checkRequestSucceeded } from "../utils";

type ApiSortSearchPropsType = {
  payload?: any;
  extraEffectCheck?: boolean;
  effectDependency?: any[];
  extractFromResponse?: string[];
  responseProperty?: string;
  apiToCall: (data: any) => any;
  apiName?: string;
  finallyCallback?: () => void;
};

const useLocalApi = ({
  payload = {},
  extractFromResponse = [],
  extraEffectCheck = true,
  responseProperty = "",
  effectDependency = [],
  finallyCallback = () => {},
  apiToCall,
  apiName,
}: ApiSortSearchPropsType) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [data, setData] = useState<any[] | any>([]);

  const [statusCode, setStatusCode] = useState<any[] | any>([]);
  const [dataExtractedFromResponse, setDataExtractedFromResponse] =
    useState<any>(null);

  useEffect(() => {
    if (extraEffectCheck) fetchData();
  }, [...effectDependency]);

  const fetchData = async () => {
    setIsLoading(true);
    setData([]);
    const requestData = {
      payload: {
        ...payload,
      },
      apiName,
    };
    try {
      const response = await apiToCall(requestData);
      const { data: responseData, message } = responseProperty
        ? response[responseProperty]
        : response;
      setStatusCode(response?.statusCode);

      if (!checkRequestSucceeded(response?.statusCode)) {
        // setError(message);
        console.error(message);
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

      console.error(error?.message);
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
