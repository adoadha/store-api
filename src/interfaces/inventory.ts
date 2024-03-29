export interface IStocks {
  variation_id: number;
  variation_name: string;
  variation_sku: string;
  price: number;
  qty: number;
}

export interface ICreateStocks {
  variation_id: number;
  qty: number;
}

export interface ISuplier {
  id: number;
  suplier_name: string;
  address: string;
  no_handpohone: number;
}

export interface IProductInbound {
  id_suplier: number;
  purchase_date: Date;
  product_values: IProductInboundValue[];
  keterangan?: string;
}

export interface IProductInboundValue {
  variation_id: number;
  purchase_qty: number;
}

export interface ICreateInbound {
  id_suplier: number;
  purchase_date: Date;
  variation_id: number;
  qty: number;
  keterangan?: string;
}
