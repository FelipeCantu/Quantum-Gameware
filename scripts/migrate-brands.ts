// scripts/migrate-brands.ts
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import { categories } from '../src/data/categories';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Configure Sanity client for writing data
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-08-29',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrateBrands() {
  console.log('Starting brand migration...');
  console.log(`Project ID: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`);
  console.log(`Token exists: ${process.env.SANITY_API_TOKEN ? 'Yes' : 'No'}`);
  
  // Verify we have the required environment variables
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
    return;
  }
  
  if (!process.env.NEXT_PUBLIC_SANITY_DATASET) {
    console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET in .env.local');
    return;
  }
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Missing SANITY_API_TOKEN in .env.local');
    return;
  }
  
  try {
    // Extract all unique brands from categories
    const allBrands = new Set<string>();
    categories.forEach(category => {
      category.popularBrands.forEach(brand => allBrands.add(brand));
    });
    
    console.log(`Found ${allBrands.size} unique brands to migrate:`, Array.from(allBrands));
    
    // Check existing brands
    const existingBrands = await client.fetch(`*[_type == "brand"]{name}`);
    const existingBrandNames = existingBrands.map((brand: any) => brand.name);
    
    console.log(`Found ${existingBrands.length} existing brands in Sanity`);
    
    for (const brandName of allBrands) {
      // Skip if brand already exists
      if (existingBrandNames.includes(brandName)) {
        console.log(`Brand "${brandName}" already exists, skipping...`);
        continue;
      }
      
      // Create brand document
      const brandDoc = {
        _type: 'brand',
        name: brandName,
        slug: {
          _type: 'slug',
          current: brandName.toLowerCase().replace(/\s+/g, '-')
        },
        description: `Premium gaming brand ${brandName}`,
      };
      
      console.log(`Creating brand: ${brandName}`);
      
      const result = await client.create(brandDoc);
      console.log(`✅ Created brand: ${result.name} (ID: ${result._id})`);
    }
    
    console.log('🎉 Brand migration completed successfully!');
  } catch (error) {
    console.error('❌ Error during migration:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        console.error('🔑 Check your SANITY_API_TOKEN in .env.local');
      } else if (error.message.includes('projectId')) {
        console.error('🆔 Check your NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
      }
    }
  }
}

// Run the migration
migrateBrands();