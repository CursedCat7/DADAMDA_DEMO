export type SuccessEnvelope<T> = {
  success: true;
  data: T;
  message: string;
};

export type ErrorEnvelope = {
  success: false;
  message: string;
  error: unknown;
};

export type ApiEnvelope<T> = SuccessEnvelope<T> | ErrorEnvelope;

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
