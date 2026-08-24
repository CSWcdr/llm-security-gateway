import {
    createContext,
    useState,
    type ReactNode,
  } from "react";
  
  import { mockApiKeys } from "../data/mockData";
  
  import type {
    ApiKey,
    ApiKeyEnvironment,
  } from "../types";
  
  type CreateApiKeyInput = {
    name: string;
  
    projectId: string;
    projectName: string;
  
    environment: ApiKeyEnvironment;
  };
  
  type CreateApiKeyResult = {
    apiKey: ApiKey;
  
    secret: string;
  };
  
  type ApiKeysContextType = {
    apiKeys: ApiKey[];
  
    createApiKey: (
      input: CreateApiKeyInput
    ) => CreateApiKeyResult;
  
    revokeApiKey: (
      apiKeyId: string
    ) => void;
  };
  
  export const ApiKeysContext =
    createContext<
      ApiKeysContextType | undefined
    >(undefined);
  
  type ApiKeysProviderProps = {
    children: ReactNode;
  };
  
  function generateRandomSecret(
    length = 32
  ) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    const randomValues =
      new Uint32Array(length);
  
    crypto.getRandomValues(
      randomValues
    );
  
    return Array.from(
      randomValues,
      (value) =>
        characters[
          value % characters.length
        ]
    ).join("");
  }
  
  export function ApiKeysProvider({
    children,
  }: ApiKeysProviderProps) {
    const [apiKeys, setApiKeys] =
      useState<ApiKey[]>(mockApiKeys);
  
    function createApiKey(
      input: CreateApiKeyInput
    ): CreateApiKeyResult {
      const secretPart =
        generateRandomSecret();
  
      const prefix =
        input.environment ===
        "Production"
          ? "lsg_live"
          : "lsg_test";
  
      const secret =
        `${prefix}_${secretPart}`;
  
      const newApiKey: ApiKey = {
        id: `key_${Date.now()}`,
  
        name: input.name,
  
        projectId: input.projectId,
        projectName:
          input.projectName,
  
        environment:
          input.environment,
  
        prefix,
  
        lastFour:
          secret.slice(-4),
  
        status: "Active",
  
        createdAt:
          new Date().toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "2-digit",
              year: "numeric",
            }
          ),
  
        lastUsedAt: null,
  
        requestCount: 0,
      };
  
      setApiKeys(
        (currentApiKeys) => [
          newApiKey,
          ...currentApiKeys,
        ]
      );
  
      return {
        apiKey: newApiKey,
  
        // IMPORTANT:
        // secret is returned once,
        // but not stored inside apiKeys.
        secret,
      };
    }
  
    function revokeApiKey(
      apiKeyId: string
    ) {
      setApiKeys(
        (currentApiKeys) =>
          currentApiKeys.map(
            (apiKey) =>
              apiKey.id === apiKeyId
                ? {
                    ...apiKey,
                    status: "Revoked",
                  }
                : apiKey
          )
      );
    }
  
    return (
      <ApiKeysContext.Provider
        value={{
          apiKeys,
          createApiKey,
          revokeApiKey,
        }}
      >
        {children}
      </ApiKeysContext.Provider>
    );
  }