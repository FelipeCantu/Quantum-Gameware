// scripts/migrate-products-enhanced.ts
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

// Enhanced product data with more variety - FIXED VERSION
const enhancedProducts = [
  // Gaming Keyboards
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
    name: "Razer BlackWidow V4 Pro",
    slug: "razer-blackwidow-v4-pro",
    description: "Ultimate gaming keyboard with Razer Green mechanical switches, command dial, and premium wrist rest for extended gaming sessions.",
    price: 229.99,
    categoryName: "Gaming Keyboards",
    brandName: "Razer",
    features: [
      "Razer Green Mechanical Switches",
      "Command Dial with OLED display",
      "Magnetic plush wrist rest",
      "Doubleshot ABS keycaps",
      "5 dedicated macro keys",
      "Multi-function roller and media key"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    imageUrl: "/images/products/razer-blackwidow-v4-pro.jpg"
  },
  {
    name: "Logitech G915 TKL",
    slug: "logitech-g915-tkl",
    description: "Wireless mechanical gaming keyboard with low-profile GL switches and 40-hour battery life in a tenkeyless design.",
    price: 229.99,
    categoryName: "Gaming Keyboards",
    brandName: "Logitech",
    features: [
      "GL Tactical low-profile switches",
      "LIGHTSPEED 1ms wireless technology",
      "40-hour battery life",
      "Tenkeyless design",
      "Aircraft-grade aluminum top plate",
      "Per-key RGB LIGHTSYNC"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.6,
    imageUrl: "/images/products/logitech-g915-tkl.jpg"
  },
  {
    name: "SteelSeries Apex Pro TKL",
    slug: "steelseries-apex-pro-tkl",
    description: "Competitive gaming keyboard with adjustable OmniPoint switches and magnetic wrist rest for tournament play.",
    price: 189.99,
    originalPrice: 209.99,
    categoryName: "Gaming Keyboards",
    brandName: "SteelSeries",
    features: [
      "OmniPoint 2.0 adjustable switches",
      "0.4mm to 4.0mm actuation",
      "OLED Smart Display",
      "Premium magnetic wrist rest",
      "Per-key RGB illumination",
      "Series 5000 aircraft aluminum"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.7,
    imageUrl: "/images/products/steelseries-apex-pro-tkl.jpg"
  },
  {
    name: "Redragon K552 Kumara RGB",
    slug: "redragon-k552-kumara-rgb",
    description: "Budget-friendly mechanical gaming keyboard with Blue switches, RGB backlighting, and compact tenkeyless design.",
    price: 39.99,
    originalPrice: 59.99,
    categoryName: "Gaming Keyboards",
    brandName: "Redragon",
    features: [
      "Blue mechanical switches",
      "RGB backlighting",
      "Tenkeyless design",
      "Anti-ghosting keys",
      "Splash-resistant design",
      "Metal construction"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.1,
    imageUrl: "/images/products/redragon-k552.jpg"
  },
  {
    name: "Corsair K100 RGB Optical-Mechanical",
    slug: "corsair-k100-rgb-optical-mechanical",
    description: "Flagship gaming keyboard with OPX optical-mechanical switches, iCUE control wheel, and 4,000Hz hyper-polling.",
    price: 229.99,
    categoryName: "Gaming Keyboards",
    brandName: "Corsair",
    features: [
      "OPX optical-mechanical switches",
      "4,000Hz hyper-polling technology",
      "iCUE control wheel",
      "Per-key RGB backlighting",
      "44-zone RGB light bar",
      "Tournament switch for instant profile change"
    ],
    compatibility: ["PC"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    imageUrl: "/images/products/corsair-k100-rgb.jpg"
  },

  // Gaming Mice
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
    name: "Razer DeathAdder V3 Pro",
    slug: "razer-deathadder-v3-pro",
    description: "Wireless gaming mouse with Focus Pro 30K sensor, 90-hour battery life, and ergonomic design for extended gaming sessions.",
    price: 149.99,
    categoryName: "Gaming Mice",
    brandName: "Razer",
    features: [
      "Focus Pro 30K sensor",
      "90-hour battery life", 
      "HyperSpeed wireless technology",
      "Ergonomic right-handed design",
      "5 programmable buttons",
      "HyperScroll Pro wheel"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: false,
    isNew: true,
    rating: 4.6,
    imageUrl: "/images/products/razer-deathadder-v3-pro.jpg"
  },
  {
    name: "Corsair M65 RGB Elite",
    slug: "corsair-m65-rgb-elite",
    description: "FPS gaming mouse with adjustable DPI, customizable weight system, and durable aluminum construction.",
    price: 59.99,
    originalPrice: 79.99,
    categoryName: "Gaming Mice",
    brandName: "Corsair",
    features: [
      "18,000 DPI PixArt sensor",
      "Adjustable weight system",
      "8 programmable buttons",
      "Aircraft-grade aluminum frame",
      "RGB lighting with 16.7M colors",
      "Sub-1ms report rate"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.4,
    imageUrl: "/images/products/corsair-m65-rgb-elite.jpg"
  },
  {
    name: "Logitech G203 LIGHTSYNC",
    slug: "logitech-g203-lightsync",
    description: "Affordable gaming mouse with 8,000 DPI sensor, customizable LIGHTSYNC RGB, and classic gaming shape.",
    price: 29.99,
    originalPrice: 39.99,
    categoryName: "Gaming Mice",
    brandName: "Logitech",
    features: [
      "8,000 DPI sensor",
      "LIGHTSYNC RGB technology",
      "6 programmable buttons",
      "Classic gaming mouse design",
      "Metal spring button tensioning",
      "On-the-fly DPI switching"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.3,
    imageUrl: "/images/products/logitech-g203.jpg"
  },
  {
    name: "Finalmouse Starlight-12 Phantom",
    slug: "finalmouse-starlight-12-phantom",
    description: "Ultra-lightweight gaming mouse with magnesium alloy construction, PixArt 3370 sensor, and sub-47g weight.",
    price: 189.99,
    categoryName: "Gaming Mice",
    brandName: "Finalmouse",
    features: [
      "Magnesium alloy honeycomb shell",
      "Sub-47g ultra-lightweight",
      "PixArt 3370 sensor",
      "Pure PTFE feet",
      "Infinity skin technology",
      "Limited edition design"
    ],
    compatibility: ["PC"],
    inStock: false,
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    imageUrl: "/images/products/finalmouse-starlight-12.jpg"
  },

  // Gaming Headsets
  {
    name: "SteelSeries Arctis Nova Pro Wireless",
    slug: "steelseries-arctis-nova-pro-wireless",
    description: "Premium wireless gaming headset with Active Noise Cancellation, infinity battery system, and 360° Spatial Audio.",
    price: 349.99,
    categoryName: "Gaming Headsets",
    brandName: "SteelSeries", 
    features: [
      "Active Noise Cancellation",
      "Infinity Power System (dual batteries)",
      "360° Spatial Audio",
      "Pro-grade parametric EQ",
      "ClearCast Gen 2 AI-powered microphone",
      "Multi-platform compatibility"
    ],
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    imageUrl: "/images/products/steelseries-arctis-nova-pro.jpg"
  },
  {
    name: "Corsair Virtuoso RGB Wireless XT",
    slug: "corsair-virtuoso-rgb-wireless-xt",
    description: "High-fidelity gaming headset with broadcast-grade microphone, premium memory foam, and 50mm neodymium drivers.",
    price: 269.99,
    originalPrice: 299.99,
    categoryName: "Gaming Headsets",
    brandName: "Corsair",
    features: [
      "50mm high-density neodymium drivers",
      "Broadcast-grade omni-directional microphone",
      "Premium memory foam and leatherette",
      "Up to 60 feet wireless range",
      "20-hour battery life",
      "RGB lighting zones"
    ],
    compatibility: ["PC", "PlayStation", "Xbox", "Mobile"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.5,
    imageUrl: "/images/products/corsair-virtuoso-rgb-xt.jpg"
  },
  {
    name: "HyperX Cloud Alpha Wireless",
    slug: "hyperx-cloud-alpha-wireless",
    description: "Wireless gaming headset with incredible 300-hour battery life, dual chamber drivers, and durable aluminum construction.",
    price: 199.99,
    categoryName: "Gaming Headsets",
    brandName: "HyperX",
    features: [
      "300+ hour battery life",
      "HyperX dual chamber drivers",
      "DTS Headphone:X Spatial Audio",
      "Detachable noise-cancelling microphone",
      "Durable aluminum frame",
      "Memory foam ear cushions"
    ],
    compatibility: ["PC", "PlayStation"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.6,
    imageUrl: "/images/products/hyperx-cloud-alpha-wireless.jpg"
  },
  {
    name: "HyperX Cloud Stinger Core",
    slug: "hyperx-cloud-stinger-core",
    description: "Lightweight gaming headset with 40mm directional drivers, adjustable steel slider, and swivel-to-mute microphone.",
    price: 39.99,
    categoryName: "Gaming Headsets",
    brandName: "HyperX",
    features: [
      "40mm directional drivers",
      "Lightweight comfort",
      "Adjustable steel slider",
      "Swivel-to-mute noise-cancellation microphone",
      "Multi-platform compatibility",
      "HyperX signature memory foam"
    ],
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.0,
    imageUrl: "/images/products/hyperx-cloud-stinger-core.jpg"
  },
  {
    name: "Audeze Penrose X Wireless",
    slug: "audeze-penrose-x-wireless",
    description: "Planar magnetic gaming headset with audiophile-grade drivers, low-latency wireless, and premium build quality.",
    price: 329.99,
    categoryName: "Gaming Headsets",
    brandName: "Audeze",
    features: [
      "100mm planar magnetic drivers",
      "Low-latency 2.4GHz wireless",
      "Detachable broadcast microphone",
      "15+ hour battery life",
      "Premium build materials",
      "Audeze HQ mobile app support"
    ],
    compatibility: ["PC", "Xbox", "PlayStation", "Mobile"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.7,
    imageUrl: "/images/products/audeze-penrose-x.jpg"
  },

  // Gaming Monitors
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
    name: "Samsung Odyssey G7 32\"",
    slug: "samsung-odyssey-g7-32",
    description: "32-inch curved gaming monitor with 1000R curvature, 240Hz refresh rate, and Quantum Dot technology.",
    price: 629.99,
    originalPrice: 799.99,
    categoryName: "Gaming Monitors",
    brandName: "Samsung",
    features: [
      "32-inch 1000R curved display",
      "WQHD (2560x1440) resolution",
      "240Hz refresh rate with 1ms response time",
      "Quantum Dot technology",
      "G-Sync and FreeSync Premium Pro",
      "HDR600 certification"
    ],
    compatibility: ["PC", "PlayStation", "Xbox"],
    inStock: true,
    isFeatured: true,
    isNew: false,
    rating: 4.6,
    imageUrl: "/images/products/samsung-odyssey-g7.jpg"
  },
  {
    name: "LG UltraGear 27GP950-B",
    slug: "lg-ultragear-27gp950-b",
    description: "27-inch 4K gaming monitor with 160Hz refresh rate, Nano IPS technology, and VESA DisplayHDR 600.",
    price: 849.99,
    categoryName: "Gaming Monitors",
    brandName: "LG",
    features: [
      "27-inch 4K UHD (3840x2160) display",
      "160Hz refresh rate (overclock)",
      "1ms (GtG) response time",
      "Nano IPS 1-Billion Color Technology",
      "VESA DisplayHDR 600",
      "G-SYNC Compatible & AMD FreeSync Premium Pro"
    ],
    compatibility: ["PC", "PlayStation", "Xbox"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    rating: 4.7,
    imageUrl: "/images/products/lg-ultragear-27gp950.jpg"
  },
  {
    name: "AOC C24G1 Curved Gaming Monitor",
    slug: "aoc-c24g1-curved-gaming-monitor",
    description: "24-inch curved gaming monitor with 144Hz refresh rate, 1ms response time, and FreeSync technology at an affordable price.",
    price: 179.99,
    originalPrice: 229.99,
    categoryName: "Gaming Monitors",
    brandName: "AOC",
    features: [
      "24-inch 1500R curved display",
      "Full HD (1920x1080) resolution",
      "144Hz refresh rate",
      "1ms response time",
      "AMD FreeSync technology",
      "3-sided frameless design"
    ],
    compatibility: ["PC", "PlayStation", "Xbox"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.2,
    imageUrl: "/images/products/aoc-c24g1.jpg"
  },
  {
    name: "ASUS ROG Swift OLED PG27AQDM",
    slug: "asus-rog-swift-oled-pg27aqdm",
    description: "27-inch OLED gaming monitor with 240Hz refresh rate, 0.03ms response time, and perfect blacks for ultimate gaming.",
    price: 899.99,
    categoryName: "Gaming Monitors",
    brandName: "ASUS",
    features: [
      "27-inch QHD (2560x1440) OLED panel",
      "240Hz refresh rate",
      "0.03ms response time",
      "G-SYNC compatible",
      "HDR True Black 400",
      "Custom heatsink for improved OLED longevity"
    ],
    compatibility: ["PC", "PlayStation", "Xbox"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    rating: 4.9,
    imageUrl: "/images/products/asus-rog-swift-oled.jpg"
  },

  // Gaming Accessories
  {
    name: "Elgato Stream Deck MK.2",
    slug: "elgato-stream-deck-mk2",
    description: "15-key stream deck with customizable LCD keys, one-touch operation, and unlimited control for streaming and productivity.",
    price: 149.99,
    categoryName: "Gaming Accessories",
    brandName: "Elgato",
    features: [
      "15 customizable LCD keys",
      "One-touch operation",
      "Unlimited control options",
      "Plugin ecosystem",
      "Adjustable stand included",
      "USB-C connectivity"
    ],
    compatibility: ["PC", "Mac"],
    inStock: true,
    isFeatured: true,
    isNew: true,
    rating: 4.8,
    imageUrl: "/images/products/elgato-stream-deck-mk2.jpg"
  },
  {
    name: "Razer Phone Cooler Chroma",
    slug: "razer-phone-cooler-chroma",
    description: "Universal phone cooler with Peltier cooling technology, Razer Chroma RGB, and phone clamp compatibility.",
    price: 59.99,
    categoryName: "Gaming Accessories",
    brandName: "Razer",
    features: [
      "Peltier cooling technology",
      "Universal phone compatibility",
      "Razer Chroma RGB lighting",
      "Adjustable phone clamp",
      "Quiet operation",
      "USB-C powered"
    ],
    compatibility: ["Mobile"],
    inStock: true,
    isFeatured: false,
    isNew: true,
    rating: 4.0,
    imageUrl: "/images/products/razer-phone-cooler.jpg"
  },
  {
    name: "NZXT Puck Headset Mount",
    slug: "nzxt-puck-headset-mount",
    description: "Magnetic headset mount with built-in cable management and multiple mounting options for clean desk setup.",
    price: 19.99,
    categoryName: "Gaming Accessories",
    brandName: "NZXT",
    features: [
      "Strong magnetic mount",
      "Built-in cable management",
      "Multiple mounting options",
      "Premium aluminum construction",
      "Headset compatibility",
      "Easy installation"
    ],
    compatibility: ["Universal"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.2,
    imageUrl: "/images/products/nzxt-puck.jpg"
  },
  {
    name: "Corsair Gaming Desk Pad - Extended",
    slug: "corsair-gaming-desk-pad-extended",
    description: "Extra-large desk pad with premium spill-resistant surface, anti-fray stitched edges, and optimized for gaming setups.",
    price: 39.99,
    categoryName: "Gaming Accessories",
    brandName: "Corsair",
    features: [
      "Spill-resistant surface",
      "Anti-fray stitched edges", 
      "Extended size (1200mm x 600mm)",
      "Non-slip rubber base",
      "Easy to clean",
      "Optimized for gaming setups"
    ],
    compatibility: ["Universal"],
    inStock: true,
    isFeatured: false,
    isNew: false,
    rating: 4.1,
    imageUrl: "/images/products/corsair-desk-pad.jpg"
  }
];

async function migrateEnhancedProducts() {
  console.log('Starting enhanced product migration...');
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
    
    console.log('\nProcessing products...');
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const product of enhancedProducts) {
      // Skip if product already exists
      if (existingSlugs.includes(product.slug)) {
        console.log(`⏭️  Product "${product.name}" already exists, skipping...`);
        skippedCount++;
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
      
      console.log(`🔄 Creating product: ${product.name}`);
      
      try {
        const result = await client.create(productDoc);
        console.log(`✅ Created product: ${result.name} (ID: ${result._id})`);
        createdCount++;
      } catch (error) {
        console.error(`❌ Failed to create product "${product.name}":`, error);
      }
      
      // Small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('\n🎉 Enhanced product migration completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Total products processed: ${enhancedProducts.length}`);
    console.log(`   • Products created: ${createdCount}`);
    console.log(`   • Products skipped (already exist): ${skippedCount}`);
    console.log(`   • Categories covered: ${new Set(enhancedProducts.map(p => p.categoryName)).size}`);
    console.log(`   • Brands covered: ${new Set(enhancedProducts.map(p => p.brandName)).size}`);
    console.log('\n📝 Next Steps:');
    console.log('   1. Upload product images through Sanity Studio');
    console.log('   2. Review and adjust product details as needed');
    console.log('   3. Set featured products for homepage display');
    console.log('   4. Test the frontend to ensure products display correctly');
    
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

// Run the enhanced migration
migrateEnhancedProducts();