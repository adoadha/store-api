import { IResponse } from "@/interfaces/response";
import { FastifyReply } from "fastify";

export function ResponseSuccess<TData = any>(
  reply: FastifyReply,
  {
    data,
    token,
    message,
    statusCode = 200,
    totalCount,
  }: {
    data?: TData;
    token?: string;
    message: string;
    statusCode?: number;
    totalCount?: number;
  }
) {
  const response: IResponse = {
    success: true,
    statusCode,
    message,
    data,
    token,
    totalCount,
  };

  return reply.code(statusCode).send(response);
}
