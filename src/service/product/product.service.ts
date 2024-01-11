import { ICategory } from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";

export default class ProductService {
  constructor(private productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  async createCategory(body: ICategory) {
    try {
      const addCat = await this.productRepo.createCategory(body);

      return addCat;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteCategory(categoryId: number) {
    try {
      const result = await this.productRepo.deleteCategory(categoryId);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getCategory() {
    try {
      const result = await this.productRepo.selectCategory();
      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
