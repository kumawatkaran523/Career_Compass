import { Response } from "express";

export const sendSuccess = (
  res: Response,
  data: any,
  message: string = "Success",
  statusCode: number = 200
): void => {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500,
  error?: any
): void => {
  res.status(statusCode).json({
    success: false,
    error: message,
    details: error,
    timestamp: new Date().toISOString(),
  });
};
