import {
  CreateCategoryBodySchema,
  ICategory,
  ICreateCategory,
  ICreateProduct,
  IHandlerCreateProduct,
  IProduct,
} from "@/interfaces/product";
import { IQueryParams } from "@/interfaces/request";
import ProductRepository from "@/repository/product.repository";
import CommondService from "@/service/commond/commond.service";
import ProductService from "@/service/product/product.service";
import { ErrorHandle } from "@/utils/error-helpers";
import { ResponseSuccess } from "@/utils/response";
import { FastifyReply, FastifyRequest } from "fastify";

const productRepository = new ProductRepository();
const commondService = new CommondService();
const productSevice = new ProductService(productRepository, commondService);

export const createNewCategory = async (
  request: FastifyRequest<{ Body: CreateCategoryBodySchema }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (request.validationError) {
      return ErrorHandle(request, reply, request.validationError);
    }

    const result = await commondService.uploadImage(request.body.image);

    const payload: ICreateCategory = {
      category_name: request.body.category_name,
      description: request.body.description,
      image_url: result?.secure_url ?? "",
    };

    const newCategory = await productSevice.createCategory(payload);

    return ResponseSuccess(reply, {
      data: newCategory,
      message: "success",
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
    const response = await productSevice.deleteCategory(request.body.id ?? 0);

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
  request: FastifyRequest<{ Body: IHandlerCreateProduct }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    if (request.validationError) {
      return ErrorHandle(request, reply, request.validationError);
    }

    const result = await commondService.uploadImage(
      request.body.variants[0].image_url
    );

    // console.log(request.body, "HANDLER BODY");
    const payload: ICreateProduct = {
      id: request.body.id,
      product_name: request.body.product_name,
      description: request.body.description,
      category_id: request.body.category_id,
      package_weight: request.body.package_weight,
      package_width: request.body.package_width,
      package_height: request.body.package_height,
      created_at: request.body.created_at,
      updated_at: request.body.updated_at,
      variants: [
        {
          id: request.body.variants[0].id,
          product_id: request.body.variants[0].product_id,
          variation_name: request.body.variants[0].variation_name,
          variation_sku: request.body.variants[0].variation_sku,
          image_url: result?.secure_url ?? "",
          created_at: request.body.variants[0].created_at,
          updated_at: request.body.variants[0].updated_at,
          price: request.body.variants[0].price,
          slash_price: request.body.variants[0].slash_price,
          variation_stock: request.body.variants[0].variation_stock,
          variation_values: request.body.variants[0].variation_values,
        },
      ],
    };

    console.log(payload, "HANDLER PAYLOAD");

    const response = await productSevice.createProduct(payload);

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

export const GetAllProduct = async (
  request: FastifyRequest<{ Querystring: IQueryParams }>,
  reply: FastifyReply
): Promise<IProduct[]> => {
  try {
    const page = request.query.page || 1;
    const pageSize = request.query.pageSize || 25;

    const response = await productSevice.getProduct(page, pageSize);

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const GetProductById = async (
  request: FastifyRequest<{ Params: { ProductId: number } }>,
  reply: FastifyReply
) => {
  try {
    const id = request.params.ProductId;

    const response = await productSevice.getProductById(id);

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const createOldProduct = async (
  request: FastifyRequest<{ Body: IProduct }>,
  reply: FastifyReply
): Promise<void> => {
  try {
    // if (request.validationError) {
    //   return ErrorHandle(request, reply, request.validationError);
    // }

    console.log(request.body, "body");

    const response = await productSevice.createProductOld(request.body);

    return ResponseSuccess(reply, {
      data: response,
      message: "Create Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const GetAllStocks = async (
  request: FastifyRequest<{ Querystring: IQueryParams }>,
  reply: FastifyReply
): Promise<IProduct[]> => {
  try {
    const page = request.query.page || 1;
    const pageSize = request.query.pageSize || 2;

    const response = await productSevice.getStocks(page, pageSize);

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};
