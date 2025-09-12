// scripts/add-placeholder-images.ts
import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import https from 'https';
import { Buffer } from 'buffer';

// Load environment variables
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-08-29',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Generate a placeholder image URL based on product category and name
function generatePlaceholderImageUrl(productName: string, category: string): string {
  // Using Unsplash for high-quality placeholder images
  const categoryKeywords: Record<string, string> = {
    'Gaming Keyboards': 'gaming-keyboard-mechanical',
    'Gaming Mice': 'gaming-mouse-rgb',
    'Gaming Headsets': 'gaming-headset-microphone',
    'Gaming Monitors': 'gaming-monitor-display',
    'Gaming Controllers': 'gaming-controller-gamepad',
    'Gaming Chairs': 'gaming-chair-ergonomic',
    'Mouse Pads': 'gaming-mousepad-rgb',
    'Gaming Microphones': 'studio-microphone-podcast',
    'Gaming Speakers': 'desktop-speakers-gaming',
    'Gaming Accessories': 'gaming-setup-accessories'
  };

  const keyword = categoryKeywords[category] || 'gaming-equipment';
  const width = 800;
  const height = 600;
  
  // Create a more specific search term
  const searchTerm = encodeURIComponent(keyword);
  
  return `https://source.unsplash.com/${width}x${height}/?${searchTerm}&${Math.random()}`;
}

// Alternative: Generate a solid color placeholder with text
function generateColorPlaceholderSVG(productName: string, category: string): string {
  const colors = [
    '#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316', '#84CC16'
  ];
  
  const colorIndex = productName.length % colors.length;
  const bgColor = colors[colorIndex];
  
  // Create SVG with product info
  const svg = `
    <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="32" font-weight="bold" 
            text-anchor="middle" fill="white" opacity="0.9">
        ${category}
      </text>
      <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" 
            text-anchor="middle" fill="white" opacity="0.8">
        ${productName.length > 30 ? productName.substring(0, 30) + '...' : productName}
      </text>
      <circle cx="100" cy="100" r="20" fill="white" opacity="0.3"/>
      <circle cx="700" cy="500" r="30" fill="white" opacity="0.2"/>
      <circle cx="150" cy="450" r="15" fill="white" opacity="0.3"/>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

async function uploadImageFromUrl(imageUrl: string, filename: string): Promise<any> {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to fetch image: ${response.statusCode}`));
        return;
      }

      const chunks: any[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        try {
          const buffer = Buffer.concat(chunks);
          const asset = await client.assets.upload('image', buffer, {
            filename: filename,
          });
          resolve(asset);
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

async function addPlaceholderImages() {
  console.log('🖼️  Starting placeholder image addition...');
  
  try {
    // Get all products without images
    const productsWithoutImages = await client.fetch(`
      *[_type == "product" && !defined(image)]{
        _id,
        name,
        "category": category->name,
        slug
      }
    `);
    
    console.log(`Found ${productsWithoutImages.length} products without images`);
    
    if (productsWithoutImages.length === 0) {
      console.log('✅ All products already have images!');
      return;
    }
    
    for (const product of productsWithoutImages) {
      console.log(`🔄 Processing: ${product.name}`);
      
      try {
        // Method 1: Try to get a real image from Unsplash (requires internet)
        let imageAsset;
        try {
          const imageUrl = generatePlaceholderImageUrl(product.name, product.category);
          const filename = `${product.slug.current || 'product'}-${Date.now()}.jpg`;
          
          console.log(`   📥 Downloading image from: ${imageUrl}`);
          imageAsset = await uploadImageFromUrl(imageUrl, filename);
          console.log(`   ✅ Uploaded image asset: ${imageAsset._id}`);
        } catch (imageError) {
          console.log(`   ⚠️  Failed to download from Unsplash, using SVG placeholder`);
          
          // Method 2: Fallback to SVG placeholder
          const svgDataUrl = generateColorPlaceholderSVG(product.name, product.category);
          const svgBuffer = Buffer.from(svgDataUrl.split(',')[1], 'base64');
          const filename = `${product.slug.current || 'product'}-placeholder.svg`;
          
          imageAsset = await client.assets.upload('image', svgBuffer, {
            filename: filename,
          });
          console.log(`   ✅ Created SVG placeholder: ${imageAsset._id}`);
        }
        
        // Update the product with the image reference
        await client
          .patch(product._id)
          .set({
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset._id,
              },
            },
          })
          .commit();
        
        console.log(`   ✅ Updated product: ${product.name}`);
        
        // Small delay to be nice to the APIs
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`   ❌ Failed to process ${product.name}:`, error);
      }
    }
    
    console.log('\n🎉 Placeholder image addition completed!');
    console.log(`📊 Summary:`);
    console.log(`   • Products processed: ${productsWithoutImages.length}`);
    console.log(`   • Images should now be visible on your site`);
    console.log(`'\n💡 Tips:`);
    console.log(`   • Replace placeholder images with real product photos in Sanity Studio`);
    console.log(`   • Upload high-quality images (recommended: 800x600px or larger)`);
    console.log(`   • Use consistent image dimensions for best results`);
    
  } catch (error) {
    console.error('❌ Error during image addition:', error);
  }
}

// Run the script
addPlaceholderImages();