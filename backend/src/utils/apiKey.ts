import {
    createHash,
    randomBytes,
  } from "node:crypto";
  
  export function generateApiKey() {
    const secret =
      randomBytes(32).toString("hex");
  
    const rawKey =
      `lsg_live_${secret}`;
  
    const keyPrefix =
      rawKey.slice(0, 16);
  
    const keyHash =
      hashApiKey(rawKey);
  
    return {
      rawKey,
      keyPrefix,
      keyHash,
    };
  }
  
  export function hashApiKey(
    apiKey: string
  ) {
    return createHash("sha256")
      .update(apiKey)
      .digest("hex");
  }