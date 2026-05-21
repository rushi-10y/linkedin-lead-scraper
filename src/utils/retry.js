import { env } from "../config/env.js";
import { logger } from "./logger.js";

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error) => {
  const status = error?.response?.status || error?.statusCode;
  if (!status) return true;
  return status === 408 || status === 409 || status === 425 || status === 429 || status >= 500;
};

export const withRetry = async (
  operation,
  {
    attempts = env.RETRY_ATTEMPTS,
    baseDelayMs = 500,
    maxDelayMs = 8000,
    label = "operation",
    retryable = shouldRetry
  } = {}
) => {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= attempts || !retryable(error)) break;

      const jitter = Math.floor(Math.random() * 250);
      const delay = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1)) + jitter;
      logger.warn(
        {
          label,
          attempt,
          nextAttempt: attempt + 1,
          delay,
          message: error.message,
          status: error?.response?.status
        },
        "Retrying failed operation"
      );
      await wait(delay);
    }
  }

  throw lastError;
};
