// components/ui/Header/Logo.tsx
import Link from 'next/link';
import Image from 'next/image';

interface LogoProps {
  isScrolled: boolean;
}

export default function Logo({ isScrolled }: LogoProps) {
  return (
    <div className="flex items-center flex-shrink-0">
      <Link href="/" className="group flex items-center space-x-3 transition-transform hover:scale-105">
        <div className={`relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 overflow-hidden rounded-xl p-1.5 shadow-lg group-hover:shadow-xl transition-all duration-300 ${
          isScrolled 
            ? 'bg-gradient-to-br from-blue-500 to-purple-600' 
            : 'bg-white/20 backdrop-blur-sm'
        }`}>
          <div className={`w-full h-full rounded-lg flex items-center justify-center ${
            isScrolled ? 'bg-white' : 'bg-white/90 backdrop-blur-sm'
          }`}>
            <Image
              src="/nextgens-logo.png"
              alt="Quantum Gameware Logo"
              width={40}
              height={40}
              className="object-contain p-1 transition-transform group-hover:scale-110"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  parent.innerHTML = '<div class="text-xl font-bold text-blue-600">QG</div>';
                }
              }}
            />
          </div>
        </div>
        <div className="hidden sm:block">
          <span className={`text-lg sm:text-xl md:text-2xl font-bold leading-none ${
            isScrolled 
              ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent'
              : 'text-white'
          }`}>
            Quantum
          </span>
          <div className={`text-xs sm:text-sm font-medium leading-none ${
            isScrolled ? 'text-gray-600' : 'text-white/80'
          }`}>
            Gameware
          </div>
        </div>
      </Link>
    </div>
  );
}