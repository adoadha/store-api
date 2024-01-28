import {
  IALLProduct,
  ICategory,
  ICreateCategory,
  IProduct,
  IVariationProduct,
} from "@/interfaces/product";
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

  async createCategory(data: { params: ICreateCategory }): Promise<ICategory> {
    try {
      const result = await this.DB.one(
        `       
      INSERT INTO category(category_name , description, image_url )
      VALUES ($<category_name>, $<description>, $<image_url>)
      RETURNING *`,
        data.params
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
      const productResult = await this.DB.one(
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
          this.DB.one(
            ` INSERT INTO product_variations (product_id, variation_name, variation_sku, created_at, price, slash_price, variation_stock)
      VALUES ( $<product_id>, $<variation_name>, $<variation_sku>, NOW(), $<price>, $<slash_price>, $<variation_stock>) RETURNING *`,
            {
              ...variation,
              product_id: productResult.id,
              slash_price:
                variation.slash_price !== undefined
                  ? variation.slash_price
                  : null,
              variation_stock:
                variation.variation_stock !== undefined
                  ? variation.variation_stock
                  : null,
            }
          )
      );

      await Promise.all(productVariationResult);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProduct(params: IProduct): Promise<void> {
    const result = await this.DB.one(`DELETE FROM product WHERE id=$1`);

    return;
  }

  async getProduct(): Promise<IALLProduct[]> {
    // tambah left join untuK type product dan image
    const result = await this.DB.many(`SELECT
    p.id AS product_id,
    p.product_name,
    c.category_name,
    array_agg(
        jsonb_build_object(
            'variation_name', pv.variation_name,
            'variation_sku', pv.variation_sku,
            'price', pv.price
        )
    ) AS variation_values,
    COUNT(pv.variation_id) AS total_variations
FROM
    product p
JOIN
    category c ON p.category_id = c.id
LEFT JOIN
    product_variations pv ON p.id = pv.product_id
GROUP BY
    p.id, p.product_name, c.category_name;`);

    return result;
  }

  async getProductById(productId: number) {
    const result = await this.DB.oneOrNone(
      ` SELECT
p.id AS product_id,
p.product_name,
p.description,
p.package_weight,
c.category_name,
p.package_width,
p.package_height,
jsonb_agg(
    jsonb_build_object(
        'variation_name', pv.variation_name,
        'variation_sku', pv.variation_sku,
        'price', pv.price
    )
) AS variation_values
FROM
product p  
JOIN
category c ON category_id = c.id
LEFT JOIN
product_variations pv ON p.id = pv.product_id
WHERE p.id = $1
GROUP BY
p.id, p.product_name, p.description, p.package_weight, c.category_name, p.package_width, p.package_height;`,
      productId
    );

    return result;
  }
}

export default ProductRepository;
