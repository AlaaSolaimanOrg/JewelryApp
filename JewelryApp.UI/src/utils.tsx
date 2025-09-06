import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./services/axios.service";

// Optional: helper to transform payload keys for GET params
const addParamsToObjKeys = (obj: Record<string, any>) => {
  // Example: prefix keys or modify as needed
  return obj;
};

export const requestApi = async (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  payload: any = {},
  authCtx: any = null,
  extraConfig: AxiosRequestConfig = {},
  params: any = {},
  addParams: boolean = false
) => {
  // Transform payload for GET requests if needed
  let finalPayload = payload;
  if (method === "GET" && addParams) {
    finalPayload = addParamsToObjKeys(payload);
  }

  const config: AxiosRequestConfig = {
    method,
    url,
    ...(authCtx && { headers: { Authorization: `Bearer ${authCtx.token}` } }),
    ...extraConfig,
  };

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    config.data = finalPayload;
  } else {
    // For GET/DELETE requests, merge payload with params
    config.params = { ...params, ...finalPayload };
  }

  try {
    const response = await axiosInstance.request(config);
    return response.data;
  } catch (error: any) {
    console.error(
      "API request error:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw error; // Re-throw to handle in the component
  }
};
