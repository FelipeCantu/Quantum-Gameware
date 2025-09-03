// src/lib/queries.ts
import { client } from './client';
import { Product } from '@/types';

// Common product fields to avoid duplication
const productFields = `
  _id,
  name,
  description,
  price,
  originalPrice,
  "image": image.asset->url,
  "images": images[].asset->url,
  "category": category->name,
  "brand": brand->name,
  features,
  compatibility,
  inStock,
  isFeatured,
  isNew,
  rating,
  "slug": slug.current,
  _createdAt,
  _updatedAt
`;

export async function getProducts(): Promise<Product[]> {
  try {
    console.log('Fetching all products...');
    const query = `
      *[_type == "product"]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    const products = await client.fetch<Product[]>(query);
    console.log('Fetched products:', products?.length || 0);
    return products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    console.log('Fetching featured products...');
    const query = `
      *[_type == "product" && isFeatured == true][0...8]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    const products = await client.fetch<Product[]>(query);
    console.log('Fetched featured products:', products?.length || 0);
    return products || [];
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    console.log('Fetching product with slug:', slug);
    const query = `
      *[_type == "product" && slug.current == $slug][0]{
        ${productFields}
      }
    `;
    
    const product = await client.fetch<Product | null>(query, { slug });
    console.log('Fetched product:', product ? product.name : 'Not found');
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Additional useful queries you might want to add:

export async function getProductsByCategory(category: string): Promise<Product[]> {
  try {
    const query = `
      *[_type == "product" && category->name == $category]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    return await client.fetch<Product[]>(query, { category }) || [];
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
}

export async function getNewProducts(limit: number = 8): Promise<Product[]> {
  try {
    const query = `
      *[_type == "product" && isNew == true][0...$limit]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    return await client.fetch<Product[]>(query, { limit }) || [];
  } catch (error) {
    console.error('Error fetching new products:', error);
    return [];
  }
}

export async function getRelatedProducts(
  currentProductId: string, 
  category: string, 
  limit: number = 4
): Promise<Product[]> {
  try {
    const query = `
      *[_type == "product" 
        && _id != $currentProductId 
        && category->name == $category
      ][0...$limit]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    return await client.fetch<Product[]>(query, { 
      currentProductId, 
      category, 
      limit 
    }) || [];
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}
