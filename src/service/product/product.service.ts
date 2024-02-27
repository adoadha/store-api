import {
  ICreateCategory,
  ICreateProduct,
  IProduct,
} from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";
import CommondService from "@/service/commond/commond.service";
import * as qr from "qrcode";

export default class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private commondService: CommondService
  ) {
    this.productRepo = productRepo;
    this.commondService = new CommondService();
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

  async createProduct(body: ICreateProduct) {
    // tambahkan validasi check sku sebelum upload
    try {
      console.log(body, "SERVICE BODY");

      const result = await this.productRepo.createTestingProduct(body);

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getProduct(page: number, pageSize: number) {
    try {
      const result = await this.productRepo.getProduct(page, pageSize);
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

  async generateQRCode(product_id: number): Promise<Buffer> {
    try {
      const url = `http://localhost:3000/product/${product_id}`;
      const qrCodeBuffer = await qr.toBuffer(url);
      return qrCodeBuffer;
    } catch (error) {
      console.error("Error generating QR code:", error);
      throw error;
    }
  }

  async createProductOld(body: IProduct) {
    // tambahkan validasi check sku sebelum upload
    try {
      const result = await this.productRepo.createProduct(body);

      const qrCodeBuffer = await this.generateQRCode(result);

      const upload = await this.commondService.uploadImage(qrCodeBuffer);

      const resultUploadCloud = await this.productRepo.UpdateUploadQR(
        upload?.url ?? "",
        result
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async getStocks(page: number, pageSize: number) {
    try {
      const result = await this.productRepo.getAllStocks(page, pageSize);

      return result;
    } catch (error) {
      console.log(error);
    }
  }
}
