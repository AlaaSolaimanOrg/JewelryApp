import type { AxiosRequestConfig } from "axios";
import axiosInstance from "./services/axios.service";
import { toast } from "react-toastify";
import qs from "qs";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import type React from "react";

// Optional: helper to transform payload keys for GET params
const addParamsToObjKeys = (obj: Record<string, any>) => {
  // Example: prefix keys or modify as needed
  return obj;
};

export const requestApi = async (
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  payload: any = {},
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
    ...extraConfig,
  };

  if (
    method === "POST" ||
    method === "PUT" ||
    method === "PATCH" ||
    method == "DELETE"
  ) {
    config.data = finalPayload;
  } else {
    // For GET/DELETE requests, merge payload with params
    config.params = { ...params, ...finalPayload };

    // Properly serialize arrays
    config.paramsSerializer = (params) =>
      qs.stringify(params, { arrayFormat: "repeat" });
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
    throw error;
  }
};

export const checkRequestSucceeded = (status: number) => {
  const successStatuses = [200, 201, 204];

  return successStatuses.includes(status);
};

export const showSuccess = (message) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

export const showError = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
  });
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};

export async function urlToFile(url: string, fileName: string): Promise<File> {
  const response = await fetch(url);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
}

export const safeValue = (value: any, fallbackValue: any = "") =>
  value ?? fallbackValue;

export function checkSKUFormat(value) {
  const regex = /^[A-Z]{3}-\d{2}-\d{4}-\d{5}$/;
  return regex.test(value);
}

function containsArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}

export const renderTooltip = (
  mainText: string | React.JSX.Element,
  subElement: string | React.JSX.Element
) => {
  const tooltip = <Tooltip id="tooltip">{subElement}</Tooltip>;

  return (
    <OverlayTrigger
      placement="top"
      delay={{ show: 250, hide: 400 }}
      overlay={tooltip}
    >
      <span>{mainText}</span>
    </OverlayTrigger>
  );
};

export const renderLongDescription = (
  description: string | undefined,
  maxLength = 15
): string | React.JSX.Element => {
  if (!description) return "";
  // Create a DOMParser to parse the HTML string
  const parser = new DOMParser();
  const doc = parser.parseFromString(description, "text/html");

  // Extract the text content without HTML tags
  const cleanedString = doc.body.textContent || "";

  // Return the first 50 characters if the string is longer than that
  if (cleanedString?.length > maxLength) {
    const isArabic = containsArabic(cleanedString.slice(0, maxLength).trim());
    const trimmedText = isArabic
      ? "..." + cleanedString.slice(0, maxLength).trim()
      : cleanedString.slice(0, maxLength).trim() + "...";
    return renderTooltip(trimmedText, cleanedString);
  }
  return cleanedString;
};
