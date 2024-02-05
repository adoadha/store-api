import { ICreateCategory, IProduct } from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";
import * as QRCode from "qrcode";
import * as fs from "fs/promises";

export default class ProductService {
  constructor(private productRepo: ProductRepository) {
    this.productRepo = productRepo;
  }

  async generateAndSaveQRCode(product_id: number, product_name: string) {
    try {
      const data = JSON.stringify({ product_id, product_name });
      const qrcodesDir = `${__dirname}/qrcodes`;
      const path = `${qrcodesDir}/${product_id}.png`;

      await fs.mkdir(qrcodesDir, { recursive: true });

      await new Promise<void>((resolve, reject) => {
        QRCode.toFile(path, data, (error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      return path;
    } catch (error) {
      throw error;
    }
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

      const convert = await this.generateAndSaveQRCode(
        result,
        body.product_name
      );

      return { result, convert };
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
