/**
 * Sanity Product Import Script
 *
 * This script imports sample products with category-specific attributes into Sanity.
 *
 * Usage:
 *   node scripts/import-products.js
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

// Initialize Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // You'll need to create this
  useCdn: false,
});

// Read sample products
const productsFile = path.join(__dirname, '..', 'sample-products.json');
const sampleProducts = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));

// Helper function to find or create a brand
async function findOrCreateBrand(brandName) {
  const query = `*[_type == "brand" && name == $brandName][0]`;
  let brand = await client.fetch(query, { brandName });

  if (!brand) {
    console.log(`Creating brand: ${brandName}`);
    brand = await client.create({
      _type: 'brand',
      name: brandName,
      slug: {
        _type: 'slug',
        current: brandName.toLowerCase().replace(/\s+/g, '-'),
      },
      description: `${brandName} gaming products`,
    });
  }

  return brand;
}

// Helper function to find or create a category
async function findOrCreateCategory(categoryName) {
  const query = `*[_type == "category" && name == $categoryName][0]`;
  let category = await client.fetch(query, { categoryName });

  if (!category) {
    console.log(`Creating category: ${categoryName}`);
    category = await client.create({
      _type: 'category',
      name: categoryName,
      slug: {
        _type: 'slug',
        current: categoryName.toLowerCase().replace(/\s+/g, '-'),
      },
      description: `Browse our selection of ${categoryName.toLowerCase()}`,
    });
  }

  return category;
}

// Main import function
async function importProducts() {
  console.log('🚀 Starting product import...\n');
  console.log(`📊 Found ${sampleProducts.length} products to import\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const productData of sampleProducts) {
    try {
      console.log(`Processing: ${productData.name}...`);

      // Check if product already exists
      const existingProduct = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: productData.slug }
      );

      if (existingProduct) {
        console.log(`⚠️  Product "${productData.name}" already exists. Skipping.\n`);
        continue;
      }

      // Find or create brand and category
      const brand = await findOrCreateBrand(productData.brand);
      const category = await findOrCreateCategory(productData.category);

      // Prepare product document
      const productDoc = {
        _type: 'product',
        name: productData.name,
        slug: {
          _type: 'slug',
          current: productData.slug,
        },
        description: productData.description,
        price: productData.price,
        originalPrice: productData.originalPrice || null,
        brand: {
          _type: 'reference',
          _ref: brand._id,
        },
        category: {
          _type: 'reference',
          _ref: category._id,
        },
        features: productData.features || [],
        compatibility: productData.compatibility || [],
        inStock: productData.inStock !== undefined ? productData.inStock : true,
        isFeatured: productData.isFeatured || false,
        isNew: productData.isNew || false,
        rating: productData.rating || null,
        categoryAttributes: productData.categoryAttributes || {},
      };

      // Create product
      const createdProduct = await client.create(productDoc);
      console.log(`✅ Created: ${createdProduct.name}`);
      console.log(`   ID: ${createdProduct._id}\n`);
      successCount++;

      // Add a small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.error(`❌ Error importing "${productData.name}":`, error.message);
      console.error(`   Details:`, error, '\n');
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📈 Import Summary:');
  console.log('='.repeat(50));
  console.log(`✅ Successfully imported: ${successCount} products`);
  console.log(`❌ Errors: ${errorCount} products`);
  console.log(`📊 Total processed: ${sampleProducts.length} products`);
  console.log('='.repeat(50) + '\n');

  if (successCount > 0) {
    console.log('🎉 Import completed! Visit your Sanity Studio to see the products.\n');
  }
}

// Run the import
importProducts()
  .then(() => {
    console.log('✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
