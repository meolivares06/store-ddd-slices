export interface ApiProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand?: string;
  sku: string;
  weight: number;
  dimensions: ApiDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ApiReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ApiMeta;
  images: string[];
  thumbnail: string;
}

export interface ApiDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ApiReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ApiMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface ApiProductResponse {
  products: ApiProduct[];
  total: number;
  skip: number;
  limit: number;
}
