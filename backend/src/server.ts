import app from "./app";

import {
  env,
} from "./config/env";

import {
  prisma,
} from "./config/prisma";

import {
  connectRedis,
  disconnectRedis,
} from "./config/redis";

async function startServer() {
  try {
    await connectRedis();

    const server =
      app.listen(
        env.PORT,
        () => {
          console.log(
            `LLM Security Gateway running on http://localhost:${env.PORT}`
          );
        }
      );

    async function shutdown(
      signal: string
    ) {
      console.log(
        `\n${signal} received. Shutting down gracefully...`
      );

      server.close(
        async () => {
          try {
            await prisma.$disconnect();

            await disconnectRedis();

            console.log(
              "Database disconnected."
            );

            console.log(
              "Redis disconnected."
            );

            console.log(
              "Server closed."
            );

            process.exit(0);
          } catch (error) {
            console.error(
              "Shutdown error:",
              error
            );

            process.exit(1);
          }
        }
      );
    }

    process.on(
      "SIGINT",
      () => {
        void shutdown(
          "SIGINT"
        );
      }
    );

    process.on(
      "SIGTERM",
      () => {
        void shutdown(
          "SIGTERM"
        );
      }
    );
  } catch (error) {
    console.error(
      "Failed to start server:",
      error
    );

    process.exit(1);
  }
}

void startServer();