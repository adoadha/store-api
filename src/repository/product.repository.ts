import { ICategory, IProduct, IVariationProduct } from "@/interfaces/product";
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
  async createProduct(params: IProduct): Promise<void> {
    try {
      await this.DB.tx(async (t) => {
        const productResult = await t.query(
          `
        INSERT INTO product (product_name, description, category_id, package_weight, package_width, package_height, created_at)
        VALUES (
          $<product_name>,  $<description>, $<category_id>, $<package_weight>, $<package_width>, $<package_height>, now()
        ) RETURNING id
        `,
          params
        );

        const productVariationResult = params.variation_values.map(
          (variation: IVariationProduct) =>
            t.query(
              ` INSERT INTO product_variations (product_id, variation_name, variation_sku, created_at, price, slash_price, variation_stock)
        VALUES ( $<product_id>, $<variation_name>, $<variation_sku>, NOW(), $<price>, $<slash_price>, $<variation_stock>) RETURNING *`,
              {
                ...variation,
                product_id: productResult.id,
                slash_price:
                  variation.slash_price !== undefined
                    ? variation.slash_price
                    : null,
              }
            )
        );

        await Promise.all(productVariationResult);
      });
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProduct(params: IProduct): Promise<void> {
    const result = await this.DB.one(`DELETE FROM product WHERE id=$1`);

    return;
  }
}

export default ProductRepository;
