import { API_LOGS_ROUTE } from "../constants";
import type { LogPayloadServer } from "../types/internal";

/** Sends a client log message to the server through a network request. */
export const sendLogToServer = (data: LogPayloadServer) => {
  if ("sendBeacon" in navigator) {
    const beaconSent = navigator.sendBeacon(
      API_LOGS_ROUTE,
      JSON.stringify(data),
    );
    if (!beaconSent) {
      console.warn("Failed to send log to server via sendBeacon");
    }
  } else {
    console.warn("navigator.sendBeacon is not supported in this browser");
  }
};
