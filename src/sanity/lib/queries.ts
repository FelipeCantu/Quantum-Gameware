// src/lib/queries.ts
import { client } from './client';
import { Product } from '@/types';

export async function getProducts(): Promise<Product[]> {
  try {
    console.log('Fetching all products...');
    const products = await client.fetch(`
      *[_type == "product"]{
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
        "slug": slug.current
      } | order(_createdAt desc)
    `);
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
    const products = await client.fetch(`
      *[_type == "product" && isFeatured == true][0...8]{
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
        "slug": slug.current
      } | order(_createdAt desc)
    `);
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
    const product = await client.fetch(`
      *[_type == "product" && slug.current == $slug][0]{
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
        "slug": slug.current
      }
    `, { slug });
    
    console.log('Fetched product:', product ? product.name : 'Not found');
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}