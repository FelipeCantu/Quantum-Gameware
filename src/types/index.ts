// src/types/index.ts
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  brand: string;
  features?: string[];
  compatibility?: string[];
  inStock: boolean;
  isFeatured: boolean;
  isNew: boolean;
  rating?: number;
  slug: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Category {
  _id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

export interface Brand {
  _id: string;
  name: string;
  description: string;
  logo: string;
  website: string;
  slug: string;
}