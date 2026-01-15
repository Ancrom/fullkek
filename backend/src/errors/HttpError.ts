export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string) {
    super(400, "VALIDATION_ERROR", message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string) {
    super(404, "NOT_FOUND", message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string) {
    super(409, "CONFLICT", message);
  }
}

export const errors = {
	HttpError,
	ValidationError,
	NotFoundError,
	ConflictError,
};