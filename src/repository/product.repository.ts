import {
  IALLProduct,
  ICategory,
  ICreateCategory,
  ICreateProduct,
  ICreateProductGalleryProductV2,
  ICreateProductV2,
  ICreateVariationProduct,
  ICreateVariationProductV2,
  IProduct,
  IProductDataV2,
  IVariationProduct,
} from "@/interfaces/product";
import db from "../lib/pg-connection";
import { deleteProduct } from "@/modules/product/handler";

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
  async createProduct(params: IProduct): Promise<any> {
    try {
      params.variation_values = params.variation_values || [];
      const productResult = await this.DB.tx(async (t) => {
        const result = await t.one(
          `
          INSERT INTO product (product_name, description, category_id, package_weight, package_width, package_height, created_at)
          VALUES (
            $<product_name>,  $<description>, $<category_id>, $<package_weight>, $<package_width>, $<package_height>, now()
          ) RETURNING id
          `,
          params
        );
        return result.id;
      });

      const productVariationResult = await Promise.all(
        params.variation_values.map(async (variation: IVariationProduct) => {
          const productVariationId = await this.DB.one(
            `INSERT INTO product_variations (product_id, variation_name, variation_sku, created_at, price, slash_price )
            VALUES ($<product_id>, $<variation_name>, $<variation_sku>, now(), $<price>, $<slash_price>) RETURNING variation_id`,
            {
              ...variation,
              product_id: productResult,
              slash_price:
                variation.slash_price !== undefined
                  ? variation.slash_price
                  : null,
            }
          );

          await this.DB.none(
            `INSERT INTO stocks (variation_id, qty, created_at)
            VALUES ($<variation_id>, $<qty>, now())`,
            {
              variation_id: productVariationId.variation_id,
              qty: variation.variation_stock,
            }
          );

          return productVariationId.variation_id;
        })
      );

      await Promise.all(productVariationResult);

      return productResult;
    } catch (error) {
      console.error(
        "Error inserting into product_variations or stocks:",
        error
      );
      return Promise.reject(error);
    }
  }

  async getProduct(page: number, pageSize: number): Promise<IALLProduct[]> {
    // tambah left join untuK type product dan image
    const offset = (page - 1) * pageSize;

    const result = await this.DB.many(
      `SELECT
    p.id AS product_id,
    p.product_name,
    c.category_name,
    p.thumbnail_images_url,
    array_agg(
        jsonb_build_object(
            'variation_name', pv.variation_name,
            'variation_sku', pv.variation_sku,
            'price', pv.price,
            'slash_price', pv.slash_price,
            'grosir_price', pv.grosir_price,
            'HPP', pv.hpp     
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
    p.id, p.product_name, c.category_name
ORDER BY p.created_at  desc 
OFFSET $1 LIMIT $2 
    ;`,
      [offset, pageSize]
    );

    return result;
  }

  async getProductById(productId: number): Promise<IProductDataV2> {
    let whereClause = `  WHERE p.id = $<productId>`;
    const result = await this.DB.oneOrNone(
      `SELECT
      p.id AS product_id,
      p.product_name,
      p.description,
      p.package_weight,
      c.category_name,
      p.package_width,
      p.package_height,
      p.qr_images_url,
      p.thumbnail_images_url,
      COALESCE(vv.variation_values, '[]') AS variation_values,
      COALESCE(gi.gallery_images, '[]') AS gallery_images
  FROM
      product p
  JOIN
      category c ON p.category_id = c.id
  LEFT JOIN LATERAL (
      SELECT
          jsonb_agg(
              jsonb_build_object(
                  'variation_id', pv.variation_id ,
                  'variation_sku', pv.variation_sku,
                  'variation_name', pv.variation_name,
                  'hpp', pv.hpp,
                  'price', pv.price,
                  'slash_price', pv.slash_price,
                  'qty', COALESCE(CAST(s.qty AS INTEGER), 0),  
                  'grosir_price', pv.grosir_price,
                  'image_url', pv.image_url
              )
          ) AS variation_values
      FROM
          product_variations pv
      LEFT JOIN LATERAL (
          SELECT
              s.qty
          FROM
              stocks s
          WHERE
              s.variation_id = pv.variation_id
          LIMIT 1
      ) s ON true
      WHERE
          pv.product_id = p.id
      GROUP BY
          p.id
  ) vv ON true
  LEFT JOIN LATERAL (
      SELECT
          jsonb_agg(
              jsonb_build_object(
                  'url_product_cloudinary', pgi.url_product_cloudinary
              )
          ) AS gallery_images
      FROM
          product_gallery_images pgi
      WHERE
          pgi.product_id = p.id
      GROUP BY
          p.id
  ) gi ON true
  WHERE 
      p.id = $<productId>;
`,
      { productId }
    );

    return result;
  }

  async createTestingProduct(params: ICreateProduct): Promise<any[]> {
    try {
      console.log(params, "REPO 1");
      const productResult = await this.DB.one(
        `
        INSERT INTO product (product_name, description, category_id, package_weight, package_width, package_height, created_at)
        VALUES (
          $<product_name>, $<description>, $<category_id>, $<package_weight>, $<package_width>, $<package_height>, NOW()
        ) RETURNING id
        `,
        params
      );

      const productVariationResult = await Promise.all(
        params.variants.map(async (variation: ICreateVariationProduct) => {
          const variationsValue = JSON.stringify(variation.variation_values);

          const variationResult = await this.DB.one(
            `
            INSERT INTO product_variations (product_id, variation_name, variation_sku, image_url, created_at, price, variation_stock, variation_values)
            VALUES ($<product_id>, $<variation_name>, $<variation_sku>, $<image_url>, now(), $<price>, $<variation_stock>, $<variation_values>::jsonb)
            RETURNING *
            `,
            {
              ...variation,
              product_id: productResult.id,
              variation_values: variationsValue,
            }
          );
          return variationResult;
        })
      );

      // await Promise.all(productVariationResult);

      return productVariationResult;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateUploadQR(
    qr_images_url: string,
    product_id: number
  ): Promise<void> {
    try {
      const result = await this.DB.one(
        `update product set qr_images_url = $<qr_images_url> where id = $<product_id> RETURNING *`,
        {
          qr_images_url,
          product_id,
        }
      );

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createDataBarcode(qr_images_url: string): Promise<void> {
    try {
      const result = await this.DB.one(
        `INSERT INTO images_cloudinary (url_cloudinary, created_at) values ($<url_cloudinary>, now());`,
        {
          qr_images_url,
        }
      );

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteProduct(params: IProduct): Promise<void> {
    const result = await this.DB.one(`DELETE FROM product WHERE id=$1`);

    return;
  }

  async deleteVariations(variation_id: number): Promise<void> {}

  async createProductV2(params: ICreateProductV2): Promise<any> {
    try {
      const productResult = await this.DB.one(
        `
        INSERT INTO product (product_name, description, category_id, package_weight, package_width, package_height, thumbnail_images_url, created_at)
        VALUES (
          $<product_name>, $<description>, $<category_id>, $<package_weight>, $<package_width>, $<package_height>, $<thumbnail_images_url>, NOW()
        ) RETURNING id
        `,
        params
      );

      return productResult;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async createProductVariationsV2(
    params: ICreateVariationProductV2
  ): Promise<any[]> {
    try {
      const variationResult = await this.DB.query(
        `
        INSERT INTO product_variations 
        (product_id, variation_name, variation_sku, created_at, price, slash_price, grosir_price, id_item_groceries, hpp, image_url)
        VALUES 
        ($1, $2, $3, now(), $4, $5, $6, $7, $8, $9)
        RETURNING *
        `,
        [
          params.product_id,
          params.variation_name,
          params.variation_sku,
          params.price,
          params.slash_price,
          params.grosir_price,
          params.id_item_groceries,
          params.hpp,
          params.images_url,
        ]
      );
      return variationResult;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  // async createProductGalleryV2(
  //   params: ICreateProductGalleryProductV2
  // ): Promise<any> {
  //   try {
  //     const uploadGallery = await this.DB.one(
  //       `
  //       INSERT INTO product_gallery_images (url_product_cloudinary, product_id, created_at)
  //       VALUES( $<url_product_cloudinary>, $<product_id>, now()));
  //        RETURNING *
  //       `,
  //       params
  //     );

  //     return uploadGallery;
  //   } catch (error) {
  //     return Promise.reject(error);
  //   }
  // }

  async createProductGalleryV2(
    params: ICreateProductGalleryProductV2 | ICreateProductGalleryProductV2[]
  ): Promise<any> {
    try {
      if (Array.isArray(params)) {
        // Jika params adalah array, gunakan Promise.all untuk menangani banyak entri
        const uploads = await Promise.all(
          params.map(async (item) => {
            const uploadGallery = await this.DB.one(
              `
                    INSERT INTO product_gallery_images (url_product_cloudinary, product_id, created_at)
                    VALUES($<url_product_cloudinary>, $<product_id>, now())
                    RETURNING *
                    `,
              item
            );
            return uploadGallery;
          })
        );
        return uploads;
      } else {
        // Jika params adalah objek tunggal, lakukan operasi seperti sebelumnya
        const uploadGallery = await this.DB.one(
          `
                INSERT INTO product_gallery_images (url_product_cloudinary, product_id, created_at)
                VALUES($<url_product_cloudinary>, $<product_id>, now())
                RETURNING *
                `,
          params
        );
        return uploadGallery;
      }
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default ProductRepository;
