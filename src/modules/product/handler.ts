import { ICategory, IProduct } from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";
import ProductService from "@/service/product/product.service";
import { ErrorHandle } from "@/utils/error-helpers";
import { ResponseSuccess } from "@/utils/response";
import { FastifyReply, FastifyRequest } from "fastify";

const productRepository = new ProductRepository();
const productSevice = new ProductService(productRepository);

export const createNewCategory = async (
  request: FastifyRequest<{ Body: ICategory }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (request.validationError) {
      return ErrorHandle(request, reply, request.validationError);
    }

    const response = await productSevice.createCategory(request.body);

    return ResponseSuccess(reply, {
      data: response,
      message: "Create Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const dropCategory = async (
  request: FastifyRequest<{ Body: ICategory }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const response = await productSevice.deleteCategory(request.body.id);

    return ResponseSuccess(reply, {
      data: response,
      message: "Delete Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const getCategoryProduct = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  try {
    const response = await productSevice.getCategory();

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const createNewProduct = async (
  request: FastifyRequest<{ Body: IProduct }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (request.validationError) {
      return ErrorHandle(request, reply, request.validationError);
    }

    const response = await productSevice.createProduct(request.body);

    return ResponseSuccess(reply, {
      data: response,
      message: "Create Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const deleteProduct = async (
  request: FastifyRequest<{ Body: IProduct }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    const response = await productSevice.deleteCategory(request.body.id);

    return ResponseSuccess(reply, {
      data: response,
      message: "Delete Product Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};
