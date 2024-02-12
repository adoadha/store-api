import { ICreateCustomers } from "@/interfaces/customers";
import db from "../lib/pg-connection";

class CustomerRepository {
  private static instance: CustomerRepository;
  private DB = db;

  constructor() {
    this.DB = db;
  }

  public static getInstance(): CustomerRepository {
    if (!CustomerRepository.instance) {
      CustomerRepository.instance = new CustomerRepository();
    }

    return CustomerRepository.instance;
  }

  async createCustomer(params: ICreateCustomers): Promise<ICreateCustomers> {
    try {
      const result = await this.DB.one(
        `
        INSERT INTO customers (customer_name, customer_phone, customer_email, created_at) 
        VALUES ($<customer_name>, $<customer_phone>, $<customer_email>, now()
        ) RETURNING *
        `,
        params
      );

      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getAllCustomers() {
    const result = await this.DB.many(`SELECT * FROM customers`);

    return result;
  }

  //   async getProductById(productId: number) {
  //     const result = await this.DB.oneOrNone(
  //       ` SELECT
  //   p.id AS product_id,
  //   p.product_name,
  //   p.description,
  //   p.package_weight,
  //   c.category_name,
  //   p.package_width,
  //   p.package_height,
  //   jsonb_agg(
  //       jsonb_build_object(
  //           'variation_name', pv.variation_name,
  //           'variation_sku', pv.variation_sku,
  //           'price', pv.price)
  //   ) AS variation_values
  //   FROM
  //   product p
  //   JOIN
  //   category c ON category_id = c.id
  //   LEFT JOIN
  //   product_variations pv ON p.id = pv.product_id
  //   WHERE p.id = $1
  //   GROUP BY
  //   p.id, p.product_name, p.description, p.package_weight, c.category_name, p.package_width, p.package_height;`,
  //       productId
  //     );

  //     return result;
  //   }
}

export default CustomerRepository;
