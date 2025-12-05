/**
 * DYMO Connect API Utility
 * Handles communication with DYMO Connect service with CORS support
 */

export interface DymoConfig {
  isDevelopment: boolean;
  apiBaseUrl: string;
  useBackendProxy: boolean;
}

/**
 * Get DYMO API configuration based on environment
 */
export function getDymoConfig(): DymoConfig {
  const isDevelopment = process.env.NODE_ENV === "development";

  return {
    isDevelopment,
    // In development: use Vite proxy (/DYMO -> http://127.0.0.1:41951)
    // In production: use backend proxy (/api/dymo -> backend -> http://127.0.0.1:41951)
    apiBaseUrl: isDevelopment ? "/DYMO" : "/api/dymo",
    useBackendProxy: !isDevelopment,
  };
}

/**
 * Check if DYMO Connect is accessible
 */
export async function checkDymoConnectStatus(): Promise<{
  isAccessible: boolean;
  message: string;
}> {
  try {
    const config = getDymoConfig();

    // Try to fetch DYMO status
    const response = await fetch(
      `${config.apiBaseUrl}/DLS/Printing/StatusConnected`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.ok) {
      return {
        isAccessible: true,
        message: "DYMO Connect is accessible",
      };
    } else {
      return {
        isAccessible: false,
        message: `DYMO Connect returned status ${response.status}`,
      };
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      isAccessible: false,
      message: `Failed to connect to DYMO: ${errorMessage}`,
    };
  }
}

/**
 * Make a request to DYMO API
 */
export async function makeDymoRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const config = getDymoConfig();
  const url = `${config.apiBaseUrl}${
    endpoint.startsWith("/") ? endpoint : "/" + endpoint
  }`;

  return fetch(url, {
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });
}

/**
 * Log DYMO configuration for debugging
 */
export function logDymoConfig(): void {
  const config = getDymoConfig();
  console.group("DYMO Configuration");
  console.log(
    "Environment:",
    config.isDevelopment ? "Development" : "Production"
  );
  console.log("API Base URL:", config.apiBaseUrl);
  console.log("Using Backend Proxy:", config.useBackendProxy);
  console.groupEnd();
}
