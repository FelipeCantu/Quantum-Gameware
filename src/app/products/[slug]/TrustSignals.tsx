// src/app/products/[slug]/TrustSignals.tsx
export default function TrustSignals() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      {[
        { icon: "🚚", text: "Free Shipping", subtext: "On orders over $50" },
        { icon: "🛡️", text: "Warranty", subtext: "1-year coverage" },
        { icon: "↩️", text: "Returns", subtext: "30-day policy" },
        { icon: "🔒", text: "Secure", subtext: "Safe checkout" }
      ].map((item, index) => (
        <div key={index} className="text-center p-2 md:p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/15 transition-colors border border-white/20">
          <div className="text-xl md:text-2xl mb-1 md:mb-2">{item.icon}</div>
          <div className="font-semibold text-white text-xs md:text-sm">{item.text}</div>
          <div className="text-xs text-white/70 hidden xs:block">{item.subtext}</div>
        </div>
      ))}
    </div>
  );
}