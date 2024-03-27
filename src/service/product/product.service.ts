import {
  ICreateCategory,
  ICreateProduct,
  ICreateProductTesting,
  ICreateProductV2,
  ICreateVariationProductV2,
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

      const resultUploadCloud = await this.productRepo.updateUploadQR(
        upload?.url ?? "",
        result
      );

      return result;
    } catch (error) {
      console.log(error);
    }
  }

  async createProductV2(body: ICreateProductTesting) {
    // tambahkan validasi check sku sebelum upload
    try {
      const bodyCreateProduct: ICreateProductV2 = {
        product_name: body.product_name,
        description: body.description,
        category_id: body.category_id,
        package_weight: body.package_weight,
        package_width: body.package_width,
        package_height: body.package_height,
        thumbnail_images_url:
          "https://res.cloudinary.com/dvkdqnvuj/image/upload/v1711354669/bs48ozuch5jw66rt2d7j.png",
      };

      const createdProduct = await this.productRepo.createProductV2(
        bodyCreateProduct
      );

      for (const variant of body.variants) {
        const bodyCreateVariation: ICreateVariationProductV2 = {
          product_id: createdProduct.id,
          variation_name: variant.variation_name,
          variation_sku: variant.variation_sku,
          price: variant.price,
          slash_price: variant.slash_price,
          grosir_price: variant.grosir_price,
          id_item_groceries: variant.id_item_groceries,
          hpp: variant.hpp,
          images_url: variant.images_url,
        };

        const createProductVariation =
          await this.productRepo.createProductVariationsV2(bodyCreateVariation);
      }

      const productGalleryPayload = body.product_gallery.map((item) => ({
        url_product_cloudinary: item.url_product_cloudinary,
        product_id: createdProduct.id,
      }));

      const createImageGallery = await this.productRepo.createProductGalleryV2(
        productGalleryPayload
      );

      const qrCodeBuffer = await this.generateQRCode(createdProduct.id);

      const upload = await this.commondService.uploadImage(qrCodeBuffer);

      const resultUploadCloud = await this.productRepo.updateUploadQR(
        upload?.url ?? "",
        createdProduct.id
      );
    } catch (error) {
      console.log(error);
    }
  }

  async deleteProduct(product_id: number) {
    const findProduct = await this.productRepo.getProductById(product_id);

    console.log(findProduct);

    if (!findProduct) {
      throw new Error("product not found");
    }

    // delete thumnail
    const extractThumbnail = await this.commondService.extractUrl(
      findProduct.thumbnail_images_url
    );
    const deleteThumbnail = await this.commondService.deleteImageCloudinary(
      extractThumbnail
    );

    // delete qr images
    const extractQR = await this.commondService.extractUrl(
      findProduct.qr_images_url
    );
    const deleteQRFromCloud = await this.commondService.deleteImageCloudinary(
      extractQR
    );

    // delete product gallery
    const galleryURL = findProduct.gallery_images.map(
      (gallery) => gallery.url_product_cloudinary
    );

    const extractUrl = galleryURL.map((url) =>
      this.commondService.extractUrl(url)
    );

    const resultExtract = await Promise.all(extractUrl);
    const deleteGalleryFromCloud = resultExtract.map((public_id) =>
      this.commondService.deleteImageCloudinary(public_id)
    );
    await Promise.all(deleteGalleryFromCloud);

    // delete image variation
    const getImageVariant = findProduct.variation_values.map(
      (variation) => variation.image_url
    );
    const extracVariantUrl = getImageVariant.map((url) =>
      this.commondService.extractUrl(url)
    );
    const resultExtractVariant = await Promise.all(extracVariantUrl);

    const deleteVariationFromCloud = resultExtractVariant.map((public_id) =>
      this.commondService.deleteImageCloudinary(public_id)
    );
    await Promise.all(deleteVariationFromCloud);

    //  delete product from db

    const deleteProductToDb = await this.deleteProduct(product_id);
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
