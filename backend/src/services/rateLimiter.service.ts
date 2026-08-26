import { redisClient } from "../config/redis";

export type RateLimitWindow =
  | "burst"
  | "minute"
  | "hour"
  | "day";

const WINDOW_SECONDS: Record<
  RateLimitWindow,
  number
> = {
  burst: 10,
  minute: 60,
  hour: 60 * 60,
  day: 24 * 60 * 60,
};

export async function incrementRateCounter(
  projectId: string,
  windowName: RateLimitWindow
) {
  const windowSeconds =
    WINDOW_SECONDS[windowName];

  const currentTime =
    Math.floor(Date.now() / 1000);

  const bucket =
    Math.floor(
      currentTime / windowSeconds
    );

  const key =
    `rate:${projectId}:${windowName}:${bucket}`;

  const count =
    await redisClient.incr(key);

  if (count === 1) {
    await redisClient.expire(
      key,
      windowSeconds + 5
    );
  }

  const resetIn =
    windowSeconds -
    (currentTime % windowSeconds);

  return {
    count,
    resetIn,
  };
}