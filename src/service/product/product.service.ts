import { ICategory, IProduct } from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";

export default class ProductService {
  constructor(private productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  async createCategory(body: ICategory, Image: string) {
    try {
      console.log(body, "BODY SERVICE");
      console.log(Image, "BODY SERVICE");
      const data = {
        params: body,
        Image: Image,
      };

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

  async deleteProduct(product_id: number) {}
}
