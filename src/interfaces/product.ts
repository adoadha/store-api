export interface ICategory {
  id?: number;
  category_name: string;
  description: string;
}

export interface ICreateCategory {
  category_name: string;
  description: string;
  image_url: string;
}

export interface CreateCategoryBodySchema {
  category_name: string;
  description: string;
  image: Buffer;
}

export interface IProduct {
  id: number;
  product_name: string;
  sku: string;
  description: string;
  category_id?: string;
  package_weight?: number;
  package_width?: number;
  package_height?: number;
  created_at: string;
  updated_at: string;
  variation_values: IVariationProduct[];
}

export interface IVariationProduct {
  id: number;
  product_id: number;
  variation_name: string;
  variation_sku: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  price: number;
  slash_price?: number;
  variation_stock?: number;
}

export interface IALLProduct {
  id: number;
  product_name: string;
  category_id?: string;
  created_at: string;
  updated_at: string;
  variation_values: IVariationProduct[];
  total_variations: number;
}

export interface ICreateProduct {
  id: number;
  product_name: string;
  description: string;
  category_id?: string;
  package_weight?: number;
  package_width?: number;
  package_height?: number;
  thumbnail_image_url?: string;
  created_at: string;
  updated_at: string;
  variants: ICreateVariationProduct[];
}

export interface ICreateProductTesting {
  product_name: string;
  description: string;
  category_id?: string;
  package_weight?: number;
  package_width?: number;
  package_height?: number;
  thumbnail_image_url: string;
  variants: ICreateVariationProductV2[];
  product_gallery: ICreateProductGalleryProductV2[];
}

export interface ICreateVariationProductV2 {
  product_id: number;
  variation_name: string;
  variation_sku: string;
  price: number;
  // variation_values: ICreateVariationValues[];
}

export interface ICreateVariationProduct {
  id: number;
  product_id?: number;
  variation_name: string;
  variation_sku: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  price: number;
  slash_price?: number;
  variation_stock?: number;
  variation_values: ICreateVariationValues[];
}

export interface ICreateVariationValues {
  label: string;
  value: string;
}

export interface IHandlerCreateProduct {
  id: number;
  product_name: string;
  description: string;
  category_id?: string;
  package_weight?: number;
  package_width?: number;
  package_height?: number;
  created_at: string;
  updated_at: string;
  variants: IHandlerCreateVariationProduct[];
}

export interface IHandlerCreateVariationProduct {
  id: number;
  product_id: number;
  variation_name: string;
  variation_sku: string;
  image_url: Buffer;
  created_at: string;
  updated_at: string;
  price: number;
  slash_price?: number;
  variation_stock?: number;
  variation_values: ICreateVariationValues[];
}

export interface ICreateProductV2 {
  product_name: string;
  description: string;
  category_id?: string;
  package_weight?: number;
  package_width?: number;
  package_height?: number;
  thumbnail_images_url: string;
}
export interface ICreateVariationProductV2 {
  product_id: number;
  variation_name: string;
  variation_sku: string;
  price: number;
  slash_price?: number;
  grosir_price?: number;
  id_item_groceries?: number;
  hpp?: number;
  images_url: string;
}

export interface ICreateProductGalleryProductV2 {
  url_product_cloudinary: string;
  product_id: number;
}

export interface IHandlerCreateProductV2 {
  id: number;
  product_name: string;
  description: string;
  category_id?: string;
  package_weight?: number;
  package_width?: number;
  package_height?: number;
  thumbnail_image_url: string;
  variants: IHandlerCreateVariationProduct[];
}
export interface IProductDataV2 {
  product_id: number;
  product_name: string;
  description: string;
  package_weight: number;
  category_name: string;
  package_width: number;
  package_height: number;
  qr_images_url: string;
  thumbnail_images_url: string;
  variation_values: IVariationValue[];
  gallery_images: IGalleryImage[];
}
export interface IVariationValue {
  hpp: number;
  qty: number;
  price: number;
  created_at: string;
  grosir_price: any;
  variation_id: number;
  variation_sku: string;
  variation_name: string;
  image_url: string;
}
export interface IGalleryImage {
  url_product_cloudinary: string;
}
