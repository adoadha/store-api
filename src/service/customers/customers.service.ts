import { ICreateCustomers } from "@/interfaces/customers";
import CustomerRepository from "@/repository/customer.repository";

export default class CustomerService {
  constructor(private customerRepo: CustomerRepository) {
    this.customerRepo = customerRepo;
  }

  async createUserCustomers(body: ICreateCustomers) {
    try {
      const data = await this.customerRepo.createCustomer(body);

      return data;
    } catch (error) {
      console.log(error);
    }
  }

  async getCustomers() {
    try {
      const result = await this.customerRepo.getAllCustomers();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
