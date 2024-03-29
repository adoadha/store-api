import { ICreateInbound } from "@/interfaces/inventory";
import InventoryRepository from "@/repository/inventory.repository";

export default class InventoryService {
  constructor(private inventoryRepo: InventoryRepository) {
    this.inventoryRepo = inventoryRepo;
  }

  async getStocks(page: number, pageSize: number) {
    try {
      const result = await this.inventoryRepo.getAllStocks(page, pageSize);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getAllSuplier(page: number, pageSize: number) {
    try {
      const result = await this.inventoryRepo.getAllSuplier(page, pageSize);
    } catch (error) {
      console.log(error);
    }
  }

  async createInbondStock(body: ICreateInbound) {
    try {
      const payload: ICreateInbound = {
        id_suplier: body.id_suplier,
        purchase_date: body.purchase_date,
        variation_id: body.variation_id,
        qty: body.qty,
        keterangan: body.keterangan,
      };

      const results = await this.inventoryRepo.createProductInbound(payload);

      return { results };
    } catch (error) {
      console.log(error);
    }
  }
}
