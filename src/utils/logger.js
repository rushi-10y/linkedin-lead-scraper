import fs from "node:fs";
import path from "node:path";
import pino from "pino";
import { env } from "../config/env.js";

const logDir = path.resolve("logs");
fs.mkdirSync(logDir, { recursive: true });

const targets = [
  {
    target: "pino/file",
    level: env.LOG_LEVEL,
    options: { destination: path.join(logDir, "agent-combined.log"), mkdir: true }
  },
  {
    target: "pino/file",
    level: "error",
    options: { destination: path.join(logDir, "agent-error.log"), mkdir: true }
  }
];

if (env.NODE_ENV !== "production") {
  targets.push({
    target: "pino-pretty",
    level: env.LOG_LEVEL,
    options: {
      colorize: true,
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  });
}

export const logger = pino(
  {
    level: env.LOG_LEVEL,
    base: undefined,
    timestamp: pino.stdTimeFunctions.isoTime
  },
  pino.transport({ targets })
);

export const childLogger = (context) => logger.child(context);
