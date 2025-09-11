// scripts/migrate-categories.ts
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

async function migrateCategories() {
  console.log('Starting category migration...');
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
    // Check if categories already exist
    const existingCategories = await client.fetch(`*[_type == "category"]{slug}`);
    const existingSlugs = existingCategories.map((cat: any) => cat.slug.current);
    
    console.log(`Found ${existingCategories.length} existing categories`);
    
    for (const category of categories) {
      // Skip if category already exists
      if (existingSlugs.includes(category.slug)) {
        console.log(`Category "${category.name}" already exists, skipping...`);
        continue;
      }
      
      // Create the category document
      const categoryDoc = {
        _type: 'category',
        name: category.name,
        slug: {
          _type: 'slug',
          current: category.slug
        },
        description: category.description,
      };
      
      console.log(`Creating category: ${category.name}`);
      
      const result = await client.create(categoryDoc);
      console.log(`✅ Created category: ${result.name} (ID: ${result._id})`);
    }
    
    console.log('🎉 Category migration completed successfully!');
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
migrateCategories();