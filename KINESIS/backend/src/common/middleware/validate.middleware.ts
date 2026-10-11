import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export interface RequestSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

const requestLocations = ["body", "params", "query"] as const;

export const validate = (schemas: RequestSchemas): RequestHandler => {
  return async (req, _res, next) => {
    for (const location of requestLocations) {
      const schema = schemas[location];
      if (!schema) continue;

      const parsed = await schema.parseAsync(req[location]);
      Object.defineProperty(req, location, {
        configurable: true,
        enumerable: true,
        value: parsed,
        writable: true,
      });
    }

    next();
  };
};

export default validate;
