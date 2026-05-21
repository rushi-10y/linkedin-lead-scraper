export class AppError extends Error {
  constructor(message, statusCode = 500, code = "APP_ERROR", details = undefined) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export const isOperationalError = (error) =>
  error instanceof AppError || Number.isInteger(error.statusCode);
