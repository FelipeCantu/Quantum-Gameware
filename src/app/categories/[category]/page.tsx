// src/app/categories/[category]/page.tsx
import { getProducts } from '@/sanity/lib/queries';
import Link from 'next/link';
import { getCategoryBySlug, getAllCategorySlugs } from '@/data/categories';
import CategoryNotFound from './CategoryNotFound';
import CategoryPageContent from './CategoryPageContent';

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  // Get category data
  const categoryData = getCategoryBySlug(decodedCategory);

  // Get all products and filter by category
  const allProducts = await getProducts();

  // Debug: Log category info
  if (process.env.NODE_ENV === 'development') {
    console.log('=== Category Page Debug ===');
    console.log('Requested slug:', decodedCategory);
    console.log('Category data:', categoryData?.name, 'slug:', categoryData?.slug);
    console.log('All product categories:', [...new Set(allProducts.map(p => p.category))]);
  }

  // Better category filtering logic
  const categoryProducts = allProducts.filter(product => {
    if (!product.category || !categoryData) return false;

    const productCategoryLower = product.category.toLowerCase().trim();
    const categoryNameLower = categoryData.name.toLowerCase().trim();
    const categorySlugLower = categoryData.slug.toLowerCase().trim();

    // Direct exact match - highest priority
    if (productCategoryLower === categoryNameLower) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`✓ Matched ${product.name} - exact match`);
      }
      return true;
    }

    // Extract the main keyword from category slug (e.g., "mice", "keyboards", "headsets")
    // This is the most reliable way to match
    const slugKeyword = categorySlugLower.replace(/s$/, ''); // Remove plural 's' for better matching

    // Check if product category contains the slug keyword
    // For example: "Gaming Mice" contains "mice" or "mouse"
    if (productCategoryLower.includes(categorySlugLower) ||
        productCategoryLower.includes(slugKeyword)) {
      return true;
    }

    // Also check singular/plural variations
    // mice -> mouse, keyboards -> keyboard
    const singularPlural = {
      'mice': 'mouse',
      'mouse': 'mice',
      'keyboards': 'keyboard',
      'keyboard': 'keyboards',
      'headsets': 'headset',
      'headset': 'headsets',
      'monitors': 'monitor',
      'monitor': 'monitors',
      'controllers': 'controller',
      'controller': 'controllers',
      'chairs': 'chair',
      'chair': 'chairs',
      'mousepads': 'mousepad',
      'mousepad': 'mousepads',
      'microphones': 'microphone',
      'microphone': 'microphones',
      'speakers': 'speaker',
      'speaker': 'speakers',
      'accessories': 'accessory',
      'accessory': 'accessories',
      'webcams': 'webcam',
      'webcam': 'webcams',
    };

    const alternateForm = singularPlural[categorySlugLower as keyof typeof singularPlural];
    if (alternateForm && productCategoryLower.includes(alternateForm)) {
      return true;
    }

    return false;
  });

  // Debug: Log results
  if (process.env.NODE_ENV === 'development') {
    console.log(`Found ${categoryProducts.length} products for category ${categoryData?.name}`);
    console.log('Products:', categoryProducts.map(p => `${p.name} (${p.category})`));
  }

  if (!categoryData) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0" style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}></div>
            </div>
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          </div>

          <CategoryNotFound />
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Same gradient background as home */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 pt-32">
          <div className="text-center">
            {/* Breadcrumb */}
            <nav className="flex items-center justify-center space-x-2 text-white/80 mb-8">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <Link href="/categories" className="hover:text-white transition-colors">Categories</Link>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white font-medium">{categoryData.name}</span>
            </nav>

            {/* Category Header */}
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
              <div className="text-8xl mb-4 lg:mb-0">{categoryData.icon}</div>
              <div className="text-center lg:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                  {categoryData.name}
                </h1>
                <p className="text-xl text-white/80 mb-6 leading-relaxed max-w-2xl">
                  {categoryData.description}
                </p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-white/70">
                  <span className="inline-flex items-center bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                    {categoryProducts.length} Products
                  </span>
                  <span className="bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium">
                    ${categoryData.priceRange.min} - ${categoryData.priceRange.max}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features and Products Sections */}
      <CategoryPageContent categoryData={categoryData} categoryProducts={categoryProducts} />
    </div>
  );
}

// Generate static params for all categories
export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({
    category: slug,
  }));
}