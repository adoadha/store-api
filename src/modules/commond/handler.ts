import CommondService from "@/service/commond/commond.service";
import { ErrorHandle } from "@/utils/error-helpers";
import { ResponseSuccess } from "@/utils/response";
import { FastifyReply, FastifyRequest } from "fastify";

const commondService = new CommondService();

export const handleUploadImage = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const data = await request.file();

    const buffer = (await data?.toBuffer()) as Buffer;

    const result = await commondService.uploadImage(buffer);

    return ResponseSuccess(reply, {
      data: result,
      message: "Create Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const handleDeleteImage = async (
  request: FastifyRequest<{ Params: { public_id: string } }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const { public_id } = request.params;

    await commondService.deleteImageCloudinary(public_id);

    return ResponseSuccess(reply, {
      message: "Delete Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};
