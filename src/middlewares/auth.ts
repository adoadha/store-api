import { AuthenticationError } from "@/utils/error-helpers";

import * as jwtFastify from "@fastify/jwt";
import { FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyReply {
    jwtSign(): jwtFastify.FastifyJWTOptions;
  }
}

const auth = async (request: FastifyRequest) => {
  try {
    await request.jwtVerify();
  } catch (error: any) {
    throw new AuthenticationError(error.message);
  }
};

export default auth;
