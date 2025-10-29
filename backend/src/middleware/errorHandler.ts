import { Request, Response, NextFunction } from 'express';
import { ErrorWithStatus, ApiResponse } from '../types';

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  const status = err.status || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'An unexpected error occurred';

  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message,
      details: err.details
    }
  };

  res.status(status).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Resource not found'
    }
  };
  res.status(404).json(response);
};
