import {
    createClient,
  } from "redis";
  
  import {
    env,
  } from "./env";
  
  export const redisClient =
    createClient({
      url: env.REDIS_URL,
    });
  
  redisClient.on(
    "error",
    (error) => {
      console.error(
        "Redis error:",
        error
      );
    }
  );
  
  export async function connectRedis() {
    if (
      !redisClient.isOpen
    ) {
      await redisClient.connect();
    }
  
    console.log(
      "Redis connected."
    );
  }
  
  export async function disconnectRedis() {
    if (
      redisClient.isOpen
    ) {
      await redisClient.quit();
    }
  }