import type { Request, Response } from "express";

export function notFoundHandler(_request: Request, response: Response) {
  return response.status(404).json({
    error: {
      code: "NOT_FOUND",
      message: "The requested resource was not found.",
      details: null
    }
  });
}
