'use client';

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useState } from 'react';
import { getBrands } from '@/sanity/lib/queries';
import Image from 'next/image';

interface Brand {
  _id: string;
  name: string;
  logo: string;
  slug: { current: string };
  description?: string;
  website?: string;
}

export default function BrandCarousel() {
  const { effectiveTheme } = useTheme();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const fetchedBrands = await getBrands();
        // Only include brands that have logos
        const brandsWithLogos = fetchedBrands.filter((brand: Brand) => brand.logo);
        setBrands(brandsWithLogos);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  if (loading || brands.length === 0) {
    return null; // Don't show carousel if no brands or still loading
  }

  // Calculate the total width needed for smooth animation
  const brandCount = brands.length;
  const duplicateCount = Math.max(3, Math.ceil(20 / brandCount)); // Ensure enough duplicates

  return (
    <>
      <style jsx global>{`
        @keyframes scroll-left {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100% / ${duplicateCount + 1}));
          }
        }

        .animate-scroll {
          animation: scroll-left 40s linear infinite;
          will-change: transform;
        }

        .brand-carousel:hover .animate-scroll {
          animation-play-state: paused;
        }
      `}</style>

      <section className={`py-8 md:py-12 lg:py-16 ${effectiveTheme === 'light' ? 'bg-gray-50' : 'bg-gray-900'} overflow-hidden border-y ${effectiveTheme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
        <div className="container mx-auto px-4 mb-6 md:mb-8">
          <h2 className={`text-xl md:text-2xl lg:text-3xl font-bold text-center ${effectiveTheme === 'light' ? 'text-gray-900' : 'text-white'} mb-1 md:mb-2`}>
            Trusted Brands
          </h2>
          <p className={`text-sm md:text-base text-center ${effectiveTheme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
            We carry products from the world's leading gaming brands
          </p>
        </div>

        <div className="brand-carousel relative">
          {/* Gradient overlays for smooth fade effect - responsive widths */}
          <div className={`absolute left-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-10 pointer-events-none ${effectiveTheme === 'light' ? 'bg-gradient-to-r from-gray-50 to-transparent' : 'bg-gradient-to-r from-gray-900 to-transparent'}`}></div>
          <div className={`absolute right-0 top-0 bottom-0 w-16 md:w-24 lg:w-32 z-10 pointer-events-none ${effectiveTheme === 'light' ? 'bg-gradient-to-l from-gray-50 to-transparent' : 'bg-gradient-to-l from-gray-900 to-transparent'}`}></div>

          {/* Scrolling container - single animated wrapper */}
          <div className="flex animate-scroll">
            {/* Render multiple sets of brands for seamless loop */}
            {Array.from({ length: duplicateCount + 1 }).map((_, setIndex) => (
              <div key={`brand-set-${setIndex}`} className="flex items-center gap-4 md:gap-8 lg:gap-12 px-2 md:px-4 lg:px-6 flex-shrink-0">
                {brands.map((brand, index) => (
                  <div
                    key={`brand-${setIndex}-${brand._id}-${index}`}
                    className={`flex-shrink-0 w-24 h-14 sm:w-32 sm:h-16 md:w-36 md:h-18 lg:w-40 lg:h-20 flex items-center justify-center px-2 md:px-3 lg:px-4 rounded-lg transition-all duration-300 hover:scale-110 ${
                      effectiveTheme === 'light' ? 'bg-white hover:shadow-lg' : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                  >
                    {brand.logo ? (
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={120}
                        height={60}
                        className="object-contain w-full h-full max-h-10 sm:max-h-12 md:max-h-14 lg:max-h-16"
                        style={{ filter: effectiveTheme === 'dark' ? 'brightness(0) invert(1)' : 'none' }}
                      />
                    ) : (
                      <div className={`text-xs sm:text-sm md:text-base lg:text-lg font-bold ${effectiveTheme === 'light' ? 'text-gray-800' : 'text-gray-200'}`}>
                        {brand.name}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
