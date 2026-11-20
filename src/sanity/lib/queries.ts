// src/sanity/lib/queries.ts
import { client } from './client';
import { Product } from '@/types';
import { normalizeProduct, normalizeProducts, isHiddenProduct, leafSlug } from '@/data/taxonomy';

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
  categoryAttributes,
  _createdAt,
  _updatedAt
`;

export async function getProducts(): Promise<Product[]> {
  try {
    // Only log in development to avoid cluttering production logs
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Fetching all products...');
      console.log('📊 Environment:', {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        nodeEnv: process.env.NODE_ENV
      });
    }

    // Verify client configuration
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
      throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
    }
    if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
      throw new Error('Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
    }

    const query = `
      *[_type == "product"]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    // Cached for 60s and tagged, so the layout, pages and /api/search share one result and
    // revalidateTag('products') (api/revalidate) refreshes them. A failed fetch throws before
    // anything is cached.
    const products = await client.fetch<Product[]>(query, {}, { next: { revalidate: 60, tags: ['products'] } });

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Fetched products:', {
        count: products?.length || 0,
        timestamp: new Date().toISOString(),
        sampleProduct: products?.[0]?.name || 'None'
      });
    }
    
    return normalizeProducts(products || []);
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('📋 Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Check for common Sanity errors
      if (error.message.includes('Unauthorized')) {
        console.error('🔐 Authentication issue - check your project ID and dataset');
      }
      if (error.message.includes('not found')) {
        console.error('🔍 Dataset or project not found - verify your environment variables');
      }
      if (error.message.includes('CORS')) {
        console.error('🌐 CORS issue - check your Sanity CORS settings');
      }
    }
    
    return [];
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🌟 Fetching featured products...');
    }
    
    const query = `
      *[_type == "product" && isFeatured == true][0...8]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    const products = await client.fetch<Product[]>(query);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Fetched featured products:', {
        count: products?.length || 0,
        timestamp: new Date().toISOString()
      });
    }
    
    return normalizeProducts(products || []);
  } catch (error) {
    console.error('❌ Error fetching featured products:', error);
    return [];
  }
}

export async function getProduct(slug: string): Promise<Product | null> {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔎 Fetching product with slug:', slug);
    }
    
    // Validate slug parameter
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug parameter:', slug);
      return null;
    }
    
    const query = `
      *[_type == "product" && slug.current == $slug][0]{
        ${productFields}
      }
    `;
    
    const product = await client.fetch<Product | null>(query, { slug });
    
    if (process.env.NODE_ENV === 'development') {
      console.log('📦 Fetched product result:', {
        found: !!product,
        name: product?.name || 'Not found',
        timestamp: new Date().toISOString()
      });
    }
    
    if (!product || isHiddenProduct(product.slug)) return null;
    return normalizeProduct(product);
  } catch (error) {
    console.error('❌ Error fetching product:', error);
    return null;
  }
}

// Test connection function
export async function testSanityConnection(): Promise<boolean> {
  try {
    console.log('🧪 Testing Sanity connection...');
    
    // Test with a simple query first
    const result = await client.fetch('*[_type == "product"] | length');
    
    console.log('✅ Sanity connection successful, product count:', result);
    return true;
  } catch (error) {
    console.error('❌ Sanity connection failed:', error);
    
    if (error instanceof Error) {
      // Provide specific guidance based on error type
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        console.error('🔐 Check your SANITY_PROJECT_ID and dataset permissions');
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        console.error('🔍 Project or dataset not found - verify your environment variables');
      } else if (error.message.includes('fetch')) {
        console.error('🌐 Network error - check your internet connection');
      }
    }
    
    return false;
  }
}

// Additional useful queries

/** Products in a leaf category, by slug ("mice") or display name ("Mice"). */
export async function getProductsByCategory(category: string): Promise<Product[]> {
  if (!category) {
    console.error('Category parameter is required');
    return [];
  }
  const products = await getProducts();
  return products.filter((p) => p.categorySlug === category || p.category === category);
}

export async function getNewProducts(limit: number = 8): Promise<Product[]> {
  try {
    const query = `
      *[_type == "product" && isNew == true][0...$limit]{
        ${productFields}
      } | order(_createdAt desc)
    `;
    
    const products = await client.fetch<Product[]>(query, { limit });
    return normalizeProducts(products || []);
  } catch (error) {
    console.error('Error fetching new products:', error);
    return [];
  }
}

/** Other products in the same leaf category. `category` may be the leaf slug or display name. */
export async function getRelatedProducts(
  currentProductId: string,
  category: string,
  limit: number = 4
): Promise<Product[]> {
  if (!currentProductId || !category) {
    console.error('currentProductId and category are required');
    return [];
  }
  const products = await getProducts();
  return products
    .filter((p) => p._id !== currentProductId && (leafSlug(p) === category || p.category === category))
    .slice(0, limit);
}

// Fetch all brands with logos
export async function getBrands() {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log('🏷️ Fetching brands...');
    }

    const query = `
      *[_type == "brand"]{
        _id,
        name,
        "logo": logo.asset->url,
        slug,
        description,
        website
      } | order(name asc)
    `;

    const brands = await client.fetch(query);

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Fetched brands:', {
        count: brands?.length || 0,
        timestamp: new Date().toISOString()
      });
    }

    return brands || [];
  } catch (error) {
    console.error('❌ Error fetching brands:', error);
    return [];
  }
}

// Helper function to validate environment variables
export function validateSanityConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    errors.push('Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
  }

  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    errors.push('Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
  }

  if (!process.env.NEXT_PUBLIC_SANITY_API_VERSION) {
    errors.push('Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}