// scripts/migrate-products.ts
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';

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

// Sample product data - you can expand this with your actual products
const sampleProducts = [
  {
    name: "Corsair K95 RGB Platinum XT",
    slug: "corsair-k95-rgb-platinum-xt",
    description: "Premium mechanical gaming keyboard with Cherry MX switches, RGB backlighting, and dedicated macro keys for competitive gaming.",
    price: 199.99,
    originalPrice: 249.99,
    categoryName: "Gaming Keyboards",
    brandName: "Corsair",
    features: [
      "Cherry MX RGB switches",
      "Per-key RGB backlighting",
      "6 dedicated macro keys",
      "Aircraft-grade aluminum frame",
      "USB passthrough",
      "Detachable wrist rest"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.7,
    imageUrl: "/images/products/corsair-k95.jpg"
  },
  {
    name: "Logitech G Pro X Superlight",
    slug: "logitech-g-pro-x-superlight",
    description: "Ultra-lightweight wireless gaming mouse designed for esports professionals with HERO 25K sensor and 70-hour battery life.",
    price: 149.99,
    categoryName: "Gaming Mice", 
    brandName: "Logitech",
    features: [
      "HERO 25K sensor",
      "Ultra-lightweight design (63g)",
      "LIGHTSPEED wireless technology",
      "70-hour battery life",
      "Zero additive PTFE feet",
      "Ambidextrous design"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.8,
    imageUrl: "/images/products/logitech-g-pro-x.jpg"
  },
  {
    name: "SteelSeries Arctis 7P",
    slug: "steelseries-arctis-7p",
    description: "Premium wireless gaming headset with lossless 2.4GHz audio, ClearCast microphone, and 24-hour battery life.",
    price: 169.99,
    originalPrice: 199.99,
    categoryName: "Gaming Headsets",
    brandName: "SteelSeries", 
    features: [
      "Lossless 2.4GHz wireless",
      "DTS Headphone:X v2.0 surround sound",
      "ClearCast noise-canceling microphone",
      "24-hour battery life",
      "On-headset controls",
      "Comfortable ski goggle headband"
    ],
    compatibility: ["PC", "PlayStation", "Nintendo Switch", "Mobile"],
    inStock: true,
    isFeatured: false,
    isNew: true,
    rating: 4.6,
    imageUrl: "/images/products/steelseries-arctis-7p.jpg"
  },
  {
    name: "ASUS ROG Swift PG279QM",
    slug: "asus-rog-swift-pg279qm",
    description: "27-inch 1440p gaming monitor with 240Hz refresh rate, G-SYNC compatibility, and HDR400 for competitive gaming.",
    price: 699.99,
    categoryName: "Gaming Monitors",
    brandName: "ASUS",
    features: [
      "27-inch WQHD (2560x1440) display",
      "240Hz refresh rate",
      "1ms response time",
      "G-SYNC compatible",
      "HDR400 support",
      "Ergonomic stand with tilt, swivel, pivot"
    ],
    compatibility: ["PC", "PlayStation", "Xbox"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.5,
    imageUrl: "/images/products/asus-rog-swift.jpg"
  },
  {
    name: "Razer DeathAdder V3",
    slug: "razer-deathadder-v3",
    description: "Ergonomic wired gaming mouse with Focus Pro 30K sensor, 90-hour battery life, and HyperSpeed wireless technology.",
    price: 99.99,
    categoryName: "Gaming Mice",
    brandName: "Razer",
    features: [
      "Focus Pro 30K sensor",
      "90-hour battery life", 
      "HyperSpeed wireless technology",
      "Ergonomic right-handed design",
      "5 programmable buttons",
      "Razer Chroma RGB lighting"
    ],
    compatibility: ["PC", "Mac"],
    inStock: false,
    isFeatured: false,
    isNew: true,
    rating: 4.4,
    imageUrl: "/images/products/razer-deathadder-v3.jpg"
  }
];

async function migrateProducts() {
  console.log('Starting product migration...');
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
    // Get all categories and brands with their IDs
    const [categories, brands, existingProducts] = await Promise.all([
      client.fetch(`*[_type == "category"]{_id, name, slug}`),
      client.fetch(`*[_type == "brand"]{_id, name, slug}`),
      client.fetch(`*[_type == "product"]{slug}`)
    ]);
    
    console.log(`Found ${categories.length} categories and ${brands.length} brands in Sanity`);
    console.log(`Found ${existingProducts.length} existing products`);
    
    // Create lookup maps
    const categoryMap = new Map(categories.map((cat: any) => [cat.name, cat._id]));
    const brandMap = new Map(brands.map((brand: any) => [brand.name, brand._id]));
    const existingSlugs = existingProducts.map((product: any) => product.slug.current);
    
    for (const product of sampleProducts) {
      // Skip if product already exists
      if (existingSlugs.includes(product.slug)) {
        console.log(`Product "${product.name}" already exists, skipping...`);
        continue;
      }
      
      // Get category and brand references
      const categoryId = categoryMap.get(product.categoryName);
      const brandId = brandMap.get(product.brandName);
      
      if (!categoryId) {
        console.error(`❌ Category "${product.categoryName}" not found for product "${product.name}"`);
        continue;
      }
      
      if (!brandId) {
        console.error(`❌ Brand "${product.brandName}" not found for product "${product.name}"`);
        continue;
      }
      
      // Create the product document
      const productDoc = {
        _type: 'product',
        name: product.name,
        slug: {
          _type: 'slug',
          current: product.slug
        },
        description: product.description,
        price: product.price,
        ...(product.originalPrice && { originalPrice: product.originalPrice }),
        category: {
          _type: 'reference',
          _ref: categoryId
        },
        brand: {
          _type: 'reference', 
          _ref: brandId
        },
        features: product.features,
        compatibility: product.compatibility,
        inStock: product.inStock,
        isFeatured: product.isFeatured,
        isNew: product.isNew,
        rating: product.rating,
        // Note: We're not adding the image here since we don't have actual image assets
        // You'll need to upload images through Sanity Studio or create a separate image upload script
      };
      
      console.log(`Creating product: ${product.name}`);
      
      const result = await client.create(productDoc);
      console.log(`✅ Created product: ${result.name} (ID: ${result._id})`);
    }
    
    console.log('🎉 Product migration completed successfully!');
    console.log('📝 Note: You\'ll need to upload product images manually through Sanity Studio');
    
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
migrateProducts();