import { useContext } from "react";

import { ApiKeysContext } from "../context/ApiKeysContext";

export function useApiKeys() {
  const context =
    useContext(ApiKeysContext);

  if (!context) {
    throw new Error(
      "useApiKeys must be used inside ApiKeysProvider"
    );
  }

  return context;
}