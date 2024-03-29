import { ICreateInbound, IStocks } from "@/interfaces/inventory";
import db from "../lib/pg-connection";

class InventoryRepository {
  private static instance: InventoryRepository;
  private DB = db;

  constructor() {
    this.DB = db;
  }

  public static getInstance(): InventoryRepository {
    if (!InventoryRepository.instance) {
      InventoryRepository.instance = new InventoryRepository();
    }

    return InventoryRepository.instance;
  }

  async getAllStocks(page: number, pageSize: number): Promise<IStocks[]> {
    const offset = (page - 1) * pageSize;

    const result = await this.DB.many(
      `SELECT pv.variation_id, pv.variation_name, pv.variation_sku, pv.price  , SUM(COALESCE(CAST(qty AS INTEGER), 0)) AS qty
      FROM stocks
      LEFT JOIN product_variations pv ON pv.variation_id = stocks.variation_id
      GROUP BY pv.variation_id, pv.variation_name, pv.variation_sku,pv.price ;;`,
      [offset, pageSize]
    );

    return result;
  }

  async getAllSuplier(page: number, pageSize: number): Promise<IStocks[]> {
    const offset = (page - 1) * pageSize;

    const result = await this.DB.many(`select * from suplier`, [
      offset,
      pageSize,
    ]);

    return result;
  }

  async createProductInbound(body: ICreateInbound): Promise<any> {
    try {
      await this.DB.query("BEGIN");

      const inboundResult = await this.DB.query(
        `INSERT INTO public.product_inbound
        (id_suplier, purchase_date, variation_id, qty, created_at, keterangan)
        VALUES($<id_suplier>, $<purchase_date>, $<variation_id>, $<qty>, now(), $<keterangan>)
        RETURNING *;`,
        body
      );

      const stocksResult = await this.DB.query(
        `INSERT INTO stocks
        (variation_id, qty, created_at)
        VALUES($<variation_id>, $<qty>, now())
        RETURNING *;
        `,
        body
      );

      await this.DB.query("COMMIT");

      return { inboundResult, stocksResult };
    } catch (error) {
      await this.DB.query("ROLLBACK");
      throw error;
    }
  }
}

export default InventoryRepository;
