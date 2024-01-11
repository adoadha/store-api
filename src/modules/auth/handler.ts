import { AuthLoginPayload } from "@/interfaces/auth";
import UserRepository from "@/repository/user.repository";
import { app } from "@/server";
import AuthService from "@/service/dashboard/auth.service";
import { ErrorHandle } from "@/utils/error-helpers";
import { ResponseSuccess } from "@/utils/response";
import { FastifyReply, FastifyRequest } from "fastify";

const userRepository = new UserRepository();
const authService = new AuthService(userRepository);

export const authLogin = async (
  request: FastifyRequest<{ Body: AuthLoginPayload }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (request.validationError) {
      return ErrorHandle(request, reply, request.validationError);
    }

    console.log(request.body);

    const response = await authService.signIn(
      request.body.email,
      request.body.password
    );

    const token = await app.jwt.sign(response, { expiresIn: "24h" });

    return ResponseSuccess(reply, {
      data: response,
      token,
      message: "Login Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};
