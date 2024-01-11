import { IResponse } from "@/interfaces/response";
import { ClientError } from "@/lib/exception/client-error";

import createError, { FastifyErrorConstructor } from "@fastify/error";
import { FastifyReply, FastifyRequest } from "fastify";
import { FastifySchemaValidationError } from "fastify/types/schema";

const NotFoundError: FastifyErrorConstructor = createError(
  "NOT_FOUND",
  "Error %s not found. ID: %s",
  404
);

const InputError: FastifyErrorConstructor = createError(
  "ERR_INPUT",
  "Error when input",
  400
);

const InternalServerError: FastifyErrorConstructor = createError(
  "INT_ERR",
  "%s",
  500
);

const ValidationError: FastifyErrorConstructor = createError(
  "VAL_ERR",
  "%s in %s",
  400
);

const AuthenticationError: FastifyErrorConstructor = createError(
  "AUTH_ERR",
  "%s",
  401
);

const ForbiddenError: FastifyErrorConstructor = createError(
  "FORBIDDEN",
  "%s",
  403
);

// Error Fastify Route Validator Helper
const SchemaErrorFormatter = (
  errors: FastifySchemaValidationError[],
  dataVar: string
): Error => {
  const e: any = errors[0];
  const field = e.instancePath
    .replace("/", "")
    .replace(/^[-_]*(.)/g, (_: any, c: string) => c.toUpperCase())
    .replace(/[-_]+(.)/g, (_: any, c: string) => " " + c.toUpperCase());

  let message = `${field} ${errors[0].message}`;

  // TODO: check if the enum error then add the values to message
  if (e.keyword === "enum" && e.params.allowedValues) {
    message += ` : (${e.params.allowedValues.join(", ")})`;
  }

  return new ValidationError(message, dataVar);
};

// Error functions below are supposed to handle error in handler level
const CreateError = (
  message: string,
  rep: FastifyReply,
  httpCode: number,
  code: string,
  requestId: string,
  extraInfo?: object
): FastifyReply => {
  return rep.code(httpCode).send({
    code,
    ...extraInfo,
    message: message,
  });
};

function ErrorHandle(request: FastifyRequest, reply: FastifyReply, err: any) {
  let response: IResponse;
  if (request.validationError) {
    response = {
      success: false,
      statusCode: 400,
    };

    return reply.code(400).send(request.validationError);
  } else if (err instanceof ClientError) {
    response = {
      success: false,
      message: err.message,
      statusCode: err.statusCode,
    };

    return reply.code(err.statusCode).send(response);
  } else {
    response = {
      success: false,
      message: err.message || "Ooops! Something went wrong",
      statusCode: err.statusCode || 500,
    };
    return reply.code(500).send(response);
  }
}

export {
  AuthenticationError,
  CreateError,
  ErrorHandle,
  ForbiddenError,
  InputError,
  InternalServerError,
  NotFoundError,
  SchemaErrorFormatter,
  ValidationError,
};
