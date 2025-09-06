// src/config.js
import configData from "./config.json";

export const API_URL = configData.API_URL;
export const API_TIMEOUT = configData.API_TIMEOUT;
export const APP_NAME = configData.APP_NAME;
export const API_HEADERS = { "Content-Type": "application/json" }

