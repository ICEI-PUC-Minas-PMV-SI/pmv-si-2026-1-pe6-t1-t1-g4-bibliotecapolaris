import type { Response } from 'express';

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({
    error: false,
    data,
  });
}

export function sendFailure(res: Response, errorCode: string, message: string, field?: string[], status = 400) {
  return res.status(status).json({
    error: true,
    errorCode,
    message,
    field,
  });
}
