import { ICreateInbound, IProductInbound } from "@/interfaces/inventory";
import { IProduct } from "@/interfaces/product";
import { IQueryParams } from "@/interfaces/request";
import InventoryRepository from "@/repository/inventory.repository";
import InventoryService from "@/service/inventory/inventory.service";
import { ErrorHandle } from "@/utils/error-helpers";
import { ResponseSuccess } from "@/utils/response";
import { FastifyReply, FastifyRequest } from "fastify";

const inventoryRepository = new InventoryRepository();
const inventoryService = new InventoryService(inventoryRepository);

export const GetAllStocks = async (
  request: FastifyRequest<{ Querystring: IQueryParams }>,
  reply: FastifyReply
): Promise<IProduct[]> => {
  try {
    const page = request.query.page || 1;
    const pageSize = request.query.pageSize || 25;

    const response = await inventoryService.getStocks(page, pageSize);

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const GetSuplier = async (
  request: FastifyRequest<{ Querystring: IQueryParams }>,
  reply: FastifyReply
): Promise<IProduct[]> => {
  try {
    const page = request.query.page || 1;
    const pageSize = request.query.pageSize || 25;

    const response = await inventoryService.getAllSuplier(page, pageSize);

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};

export const CreatePurchaseInbound = async (
  request: FastifyRequest<{ Body: IProductInbound }>,
  reply: FastifyReply
): Promise<any> => {
  try {
    const payload: ICreateInbound[] = request.body.product_values.map(
      (value) => ({
        id_suplier: request.body.id_suplier,
        purchase_date: request.body.purchase_date,
        variation_id: value.variation_id,
        qty: value.purchase_qty,
        keterangan: request.body.keterangan,
      })
    );

    const response = await Promise.all(
      payload.map((data) => inventoryService.createInbondStock(data))
    );

    return ResponseSuccess(reply, {
      data: response,
      message: "get Successfuly",
    });
  } catch (error) {
    return ErrorHandle(request, reply, error);
  }
};
