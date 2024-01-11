import { ICategory } from "@/interfaces/product";
import { IUser } from "../interfaces/auth";
import db from "../lib/pg-connection";

class ProductRepository {
  private static instance: ProductRepository;
  private DB = db;

  constructor() {
    this.DB = db;
  }

  public static getInstance(): ProductRepository {
    if (!ProductRepository.instance) {
      ProductRepository.instance = new ProductRepository();
    }

    return ProductRepository.instance;
  }

  async createCategory(params: ICategory): Promise<void> {
    try {
      // tambahkan setup untuk penyimpanan images
      const result = await this.DB.one(
        `       
      INSERT INTO category (
         category_name , description )
      VALUES ($<category_name>, $<description> )
      RETURNING *`,
        params
      );

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCategory(categoryId: number) {
    const result = await this.DB.one(
      `delete from  category where  id =$1`,
      categoryId
    );

    return;
  }

  async selectCategory() {
    const result = await this.DB.many(`SELECT * FROM category`);

    return result;
  }
}

export default ProductRepository;
