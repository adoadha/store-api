export interface ICategory {
  id?: number;
  category_name: string;
  description: string;
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
}
