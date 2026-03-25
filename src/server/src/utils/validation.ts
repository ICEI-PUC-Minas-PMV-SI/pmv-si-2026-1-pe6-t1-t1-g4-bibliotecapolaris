import type { ZodTypeAny } from 'zod';
import { ZodError } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validateBody = (schema: ZodTypeAny) => (req: Request, res: Response, next: NextFunction) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        error: true,
        errorCode: 'ERR_VALIDATION',
        message: 'Request validation failed',
        details: error.format(),
      });
    }
    return next(error);
  }
};
