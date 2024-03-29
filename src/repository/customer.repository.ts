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
}

export default CustomerRepository;
