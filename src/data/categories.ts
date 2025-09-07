// src/data/categories.ts
export interface CategoryData {
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  features: string[];
  popularBrands: string[];
  priceRange: {
    min: number;
    max: number;
  };
  compatibility: string[];
}

export const categories: CategoryData[] = [
  {
    name: "Gaming Keyboards",
    slug: "keyboards",
    description: "Mechanical and membrane keyboards designed for competitive gaming with RGB lighting, macro keys, and ultra-fast response times.",
    icon: "⌨️",
    image: "/images/categories/keyboards.jpg",
    features: [
      "Mechanical switches for tactile feedback",
      "RGB backlighting with customizable effects",
      "Programmable macro keys",
      "Anti-ghosting technology",
      "Detachable USB-C cables",
      "Aluminum construction"
    ],
    popularBrands: ["Corsair", "Razer", "Logitech", "SteelSeries", "HyperX"],
    priceRange: { min: 49, max: 299 },
    compatibility: ["PC", "Mac", "PlayStation", "Xbox"]
  },
  {
    name: "Gaming Mice",
    slug: "mice",
    description: "High-precision gaming mice with customizable DPI, ergonomic designs, and programmable buttons for FPS, MOBA, and MMO gaming.",
    icon: "🖱️",
    image: "/images/categories/mice.jpg",
    features: [
      "High-precision optical sensors",
      "Adjustable DPI up to 20,000+",
      "Programmable buttons",
      "Ergonomic design",
      "RGB lighting",
      "Ultra-lightweight construction"
    ],
    popularBrands: ["Logitech", "Razer", "SteelSeries", "Corsair", "Glorious"],
    priceRange: { min: 29, max: 199 },
    compatibility: ["PC", "Mac", "PlayStation", "Xbox"]
  },
  {
    name: "Gaming Headsets",
    slug: "headsets",
    description: "Immersive gaming headsets with surround sound, noise cancellation, and crystal-clear microphones for team communication.",
    icon: "🎧",
    image: "/images/categories/headsets.jpg",
    features: [
      "7.1 surround sound",
      "Noise-canceling microphone",
      "Comfortable ear cushions",
      "RGB lighting effects",
      "Wireless connectivity",
      "Long battery life"
    ],
    popularBrands: ["SteelSeries", "HyperX", "Corsair", "Razer", "Audio-Technica"],
    priceRange: { min: 39, max: 399 },
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"]
  },
  {
    name: "Gaming Monitors",
    slug: "monitors",
    description: "High-refresh rate gaming monitors with low input lag, adaptive sync technology, and stunning visual quality for competitive gaming.",
    icon: "🖥️",
    image: "/images/categories/monitors.jpg",
    features: [
      "High refresh rates (144Hz-360Hz)",
      "Low input lag (<1ms)",
      "G-Sync/FreeSync compatibility",
      "4K and ultrawide options",
      "HDR support",
      "Adjustable stands"
    ],
    popularBrands: ["ASUS", "Acer", "BenQ", "Samsung", "LG"],
    priceRange: { min: 199, max: 1299 },
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch"]
  },
  {
    name: "Gaming Controllers",
    slug: "controllers",
    description: "Professional gaming controllers with customizable buttons, adjustable triggers, and enhanced grip for console and PC gaming.",
    icon: "🎮",
    image: "/images/categories/controllers.jpg",
    features: [
      "Customizable button mapping",
      "Adjustable trigger stops",
      "Enhanced grip surfaces",
      "Wireless connectivity",
      "Long battery life",
      "Pro-level customization"
    ],
    popularBrands: ["Xbox", "PlayStation", "SCUF", "Elite", "PowerA"],
    priceRange: { min: 59, max: 299 },
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"]
  },
  {
    name: "Gaming Chairs",
    slug: "chairs",
    description: "Ergonomic gaming chairs designed for long gaming sessions with lumbar support, adjustable armrests, and premium materials.",
    icon: "💺",
    image: "/images/categories/chairs.jpg",
    features: [
      "Ergonomic design",
      "Lumbar support",
      "Adjustable armrests",
      "Reclining backrest",
      "Premium materials",
      "Weight capacity up to 400lbs"
    ],
    popularBrands: ["Secretlab", "DXRacer", "Herman Miller", "Corsair", "Noblechairs"],
    priceRange: { min: 199, max: 1499 },
    compatibility: ["Universal"]
  },
  {
    name: "Mouse Pads",
    slug: "mousepads",
    description: "Premium gaming mouse pads with optimized surfaces for different gaming styles, RGB lighting, and extended sizes.",
    icon: "🔲",
    image: "/images/categories/mousepads.jpg",
    features: [
      "Optimized surface textures",
      "RGB lighting integration",
      "Extended sizes",
      "Anti-slip rubber base",
      "Water-resistant coating",
      "Easy to clean"
    ],
    popularBrands: ["Corsair", "Razer", "SteelSeries", "Logitech", "Glorious"],
    priceRange: { min: 19, max: 149 },
    compatibility: ["Universal"]
  },
  {
    name: "Gaming Microphones",
    slug: "microphones",
    description: "Professional streaming and gaming microphones with studio-quality audio, noise cancellation, and easy setup.",
    icon: "🎤",
    image: "/images/categories/microphones.jpg",
    features: [
      "Studio-quality audio",
      "Noise cancellation",
      "USB plug-and-play",
      "Adjustable boom arms",
      "Mute controls",
      "Real-time monitoring"
    ],
    popularBrands: ["Blue Yeti", "Audio-Technica", "Shure", "Rode", "HyperX"],
    priceRange: { min: 49, max: 399 },
    compatibility: ["PC", "Mac", "PlayStation", "Xbox"]
  },
  {
    name: "Gaming Speakers",
    slug: "speakers",
    description: "High-quality gaming speakers with immersive sound, RGB lighting, and powerful bass for an enhanced gaming experience.",
    icon: "🔊",
    image: "/images/categories/speakers.jpg",
    features: [
      "Immersive surround sound",
      "Powerful subwoofers",
      "RGB lighting effects",
      "Multiple connectivity options",
      "Easy volume controls",
      "Compact desktop design"
    ],
    popularBrands: ["Logitech", "Creative", "Razer", "Corsair", "JBL"],
    priceRange: { min: 39, max: 299 },
    compatibility: ["PC", "Mac", "Mobile", "Gaming Consoles"]
  },
  {
    name: "Gaming Accessories",
    slug: "accessories",
    description: "Essential gaming accessories including cable management, lighting, cooling solutions, and desk organizers.",
    icon: "🔧",
    image: "/images/categories/accessories.jpg",
    features: [
      "Cable management solutions",
      "RGB lighting strips",
      "Cooling pads and fans",
      "Desk organizers",
      "Phone holders",
      "Gaming desk upgrades"
    ],
    popularBrands: ["Corsair", "Razer", "NZXT", "Cooler Master", "Generic"],
    priceRange: { min: 9, max: 199 },
    compatibility: ["Universal"]
  }
];

export const getCategoryBySlug = (slug: string): CategoryData | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getAllCategorySlugs = (): string[] => {
  return categories.map(category => category.slug);
};