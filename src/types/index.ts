export type SortOrder = 'asc' | 'desc';

export type ProductSortField =
  | 'title'
  | 'brand'
  | 'sku'
  | 'rating'
  | 'price'
  | 'stock';

export interface DummyProduct {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  thumbnail: string;
  images: string[];
}

export interface ProductsListResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface LoginErrorBody {
  message: string;
}

export interface AddProductFormValues {
  title: string;
  price: string;
  brand: string;
  sku: string;
}
