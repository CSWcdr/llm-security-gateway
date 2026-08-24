import { useContext } from "react";

import {
  RateLimitsContext,
} from "../context/RateLimitsContext";

export function useRateLimits() {
  const context =
    useContext(RateLimitsContext);

  if (!context) {
    throw new Error(
      "useRateLimits must be used inside RateLimitsProvider"
    );
  }

  return context;
}