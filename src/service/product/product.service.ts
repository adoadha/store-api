import { ICreateCategory, ICreateProduct } from "@/interfaces/product";
import ProductRepository from "@/repository/product.repository";
import CommondService from "../commond/commond.service";
import * as qrcode from "qrcode";

interface createProductResult {
  id: number;
}

export default class ProductService {
  constructor(
    private productRepo: ProductRepository,
    private commondService: CommondService
  ) {
    this.productRepo = productRepo;
    this.commondService = commondService;
  }

  async createProduct(body: ICreateProduct) {
    // tambahkan validasi check sku sebelum upload
    try {
      const result = await this.productRepo.createTestingProduct(body);

      const makeQRCode = await this.generateQRCodeURL(result.id);

      console.log(result.id, "RESULT UPLOAD");

      const qrBuffer = await this.generateQRCodeBuffer(makeQRCode);

      const qrUploadToCloud = await this.commondService.uploadImage(qrBuffer);

      return result;
    } catch (error) {
      console.log(error);
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

  async generateQRCodeURL(product_id: number): Promise<string> {
    const baseUrl = "http://localhost:3000/product/";

    return `${baseUrl}`;
  }

  async generateQRCodeBuffer(qrCodeUrl: string): Promise<Buffer> {
    try {
      const qrCodeDataUrl = await qrcode.toDataURL(qrCodeUrl);

      const qrCodeBuffer = Buffer.from(qrCodeDataUrl.split(",")[1], "base64");

      return qrCodeBuffer;
    } catch (error) {
      console.error("Error generating QR Code:", error);
      throw new Error("Error generating QR Code");
    }
  }
}
