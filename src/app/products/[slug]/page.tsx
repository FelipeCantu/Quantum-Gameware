// src/app/products/[slug]/page.tsx
// Product page (DESIGN.md, catalog pass): gallery | sticky buy column on desktop, stacked with a
// sticky buy bar on phones. Details below as a spec table, then related gear from the same leaf.
import { Metadata } from 'next';
import { getProduct, getProducts, getRelatedProducts } from '../../../sanity/lib/queries';
import { SITE_URL } from '@/config/site';
import ProductImageGallery from './ProductImageGallery';
import BuyPanel from './BuyPanel';
import ProductDetails from './ProductDetails';
import Breadcrumb from './Breadcrumb';
import { notFound } from 'next/navigation';
import RelatedProducts from './RelatedProducts';

export const revalidate = 60;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  // Unknown and hidden products get a real 404 (not-found.tsx renders the designed page).
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product._id, product.categorySlug || product.category, 8);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.image ? { image: [product.image, ...(product.images || [])].filter(Boolean) } : {}),
    brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
    category: product.category,
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/products/${product.slug}`,
      priceCurrency: 'USD',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    },
  };

  return (
    <>
      <article className="pdp">
        <Breadcrumb product={product} />
        <div className="pdp__grid">
          <ProductImageGallery product={product} />
          <BuyPanel product={product} />
        </div>
        <ProductDetails product={product} />
      </article>

      <RelatedProducts products={relatedProducts} category={product.category} categorySlug={product.categorySlug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      slug: product.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const { slug } = await params;
    const product = await getProduct(slug);

    if (!product) {
      return {
        title: 'Product not found',
        description: 'The product you are looking for could not be found.',
      };
    }

    const price = product.originalPrice && product.originalPrice > product.price
      ? `$${product.price} (was $${product.originalPrice})`
      : `$${product.price}`;

    const description = `${product.description} ${price}. ${product.inStock ? 'In stock and ready to ship.' : 'Currently out of stock.'}`;

    return {
      title: `${product.name} by ${product.brand}`,
      description,
      keywords: [
        product.name,
        product.brand,
        product.category,
        'gaming',
        'accessories',
        ...(product.features || [])
      ].join(', '),
      openGraph: {
        title: `${product.name} - ${product.brand}`,
        description,
        url: `/products/${slug}`,
        siteName: 'Quantum Gameware',
        ...(product.image ? { images: [{ url: product.image, width: 1200, height: 630, alt: product.name }] } : {}),
        locale: 'en_US',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} - ${product.brand}`,
        description,
        ...(product.image ? { images: [product.image] } : {}),
        creator: '@quantumgameware',
      },
      robots: {
        index: product.inStock,
        follow: true,
        googleBot: {
          index: product.inStock,
          follow: true,
        },
      },
      alternates: {
        canonical: `/products/${slug}`,
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Product',
      description: 'Gaming accessories and gear at Quantum Gameware',
    };
  }
}
