import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

export function validate(schema: ZodTypeAny) {
  return (request: Request, _response: Response, next: NextFunction) => {
    schema.parse({
      body: request.body,
      query: request.query,
      params: request.params,
      headers: request.headers
    });

    next();
  };
}
