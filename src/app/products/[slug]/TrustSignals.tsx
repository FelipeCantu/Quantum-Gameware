// src/app/products/[slug]/TrustSignals.tsx
export default function TrustSignals() {
  const trustItems = [
    { 
      icon: "🚚", 
      text: "Free Shipping", 
      subtext: "On orders over $50",
      color: "from-blue-500 to-blue-600"
    },
    { 
      icon: "🛡️", 
      text: "Warranty", 
      subtext: "1-year coverage",
      color: "from-green-500 to-green-600"
    },
    { 
      icon: "↩️", 
      text: "Returns", 
      subtext: "30-day policy",
      color: "from-purple-500 to-purple-600"
    },
    { 
      icon: "🔒", 
      text: "Secure", 
      subtext: "Safe checkout",
      color: "from-orange-500 to-orange-600"
    }
  ];

  return (
    <div className="space-y-3 md:space-y-4">
      <h3 className="text-white/90 font-semibold text-sm md:text-base">Why Choose Us</h3>
      
      {/* Desktop: 2x2 Grid, Tablet: 2x2, Mobile: 1 column */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {trustItems.map((item, index) => (
          <div 
            key={index} 
            className="group relative overflow-hidden bg-white/10 backdrop-blur-sm rounded-xl md:rounded-2xl border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative p-3 md:p-4 text-center">
              <div className="text-xl md:text-2xl lg:text-3xl mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <div className="font-semibold text-white text-sm md:text-base lg:text-lg mb-1">
                {item.text}
              </div>
              <div className="text-xs md:text-sm text-white/70 group-hover:text-white/90 transition-colors duration-300">
                {item.subtext}
              </div>
            </div>

            {/* Hover effect border */}
            <div className="absolute inset-0 rounded-xl md:rounded-2xl border-2 border-transparent group-hover:border-white/20 transition-colors duration-300"></div>
          </div>
        ))}
      </div>

      {/* Additional Trust Elements */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 md:mt-6 p-3 md:p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-white/90 font-medium text-sm md:text-base">
            Trusted by 10,000+ Gamers
          </span>
        </div>
        
        <div className="flex items-center gap-1 md:gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm md:text-base">★</span>
            ))}
          </div>
          <span className="text-white/80 text-xs md:text-sm ml-1 md:ml-2">
            4.9/5 Rating
          </span>
        </div>
      </div>
    </div>
  );
}