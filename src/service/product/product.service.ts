import { ICategory, ICreateCategory, IProduct } from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";

export default class ProductService {
  constructor(private productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  async createCategory(request: ICreateCategory) {
    const data = {
      params: request,
    };

    try {
      const addCat = await this.productRepo.createCategory(data);

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

  async createProduct(body: IProduct) {
    // tambahkan validasi check sku sebelum upload
    try {
      const result = await this.productRepo.createProduct(body);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getProduct() {
    try {
      const result = await this.productRepo.getProduct();
      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getProductById(ProductId: number) {
    try {
      const result = await this.productRepo.getProductById(ProductId);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(product_id: number) {}
}
