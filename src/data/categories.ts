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
  sampleProducts?: SampleProduct[];
  subcategories?: string[];
  techSpecs?: string[];
}

export interface SampleProduct {
  name: string;
  price: number;
  originalPrice?: number;
  brand: string;
  rating: number;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  shortDescription: string;
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
    popularBrands: ["Corsair", "Razer", "Logitech", "SteelSeries", "HyperX", "Cherry", "Ducky", "Keychron"],
    priceRange: { min: 49, max: 399 },
    compatibility: ["PC", "Mac", "PlayStation", "Xbox"],
    subcategories: ["Mechanical", "Membrane", "Wireless", "TKL", "60%", "Full Size"],
    techSpecs: ["Switch Type", "Actuation Force", "Key Layout", "Polling Rate", "Battery Life"],
    sampleProducts: [
      {
        name: "Corsair K95 RGB Platinum XT",
        price: 199.99,
        originalPrice: 249.99,
        brand: "Corsair",
        rating: 4.8,
        features: ["Cherry MX Speed switches", "6 macro keys", "USB passthrough"],
        isFeatured: true,
        shortDescription: "Premium mechanical keyboard with dedicated macro keys"
      },
      {
        name: "Razer BlackWidow V4 Pro",
        price: 229.99,
        brand: "Razer",
        rating: 4.7,
        features: ["Razer Green switches", "Command dial", "Magnetic wrist rest"],
        isNew: true,
        shortDescription: "Tournament-grade mechanical keyboard with command dial"
      },
      {
        name: "Logitech G Pro X",
        price: 129.99,
        brand: "Logitech",
        rating: 4.6,
        features: ["Hot-swappable switches", "Tenkeyless design", "RGB lighting"],
        shortDescription: "Compact esports keyboard with swappable switches"
      },
      {
        name: "SteelSeries Apex Pro",
        price: 179.99,
        brand: "SteelSeries",
        rating: 4.5,
        features: ["Adjustable actuation", "OLED display", "Magnetic wrist rest"],
        shortDescription: "Adjustable mechanical switches for any game"
      },
      {
        name: "HyperX Alloy Origins Core",
        price: 79.99,
        brand: "HyperX",
        rating: 4.4,
        features: ["HyperX Red switches", "Compact TKL", "Solid steel frame"],
        shortDescription: "Tenkeyless mechanical gaming keyboard"
      },
      {
        name: "Keychron K8 Wireless",
        price: 89.99,
        brand: "Keychron",
        rating: 4.6,
        features: ["Wireless connectivity", "Mac/PC compatible", "Hot-swappable"],
        shortDescription: "Wireless mechanical keyboard for Mac and PC"
      }
    ]
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
    popularBrands: ["Logitech", "Razer", "SteelSeries", "Corsair", "Glorious", "Finalmouse", "Zowie", "Roccat"],
    priceRange: { min: 29, max: 199 },
    compatibility: ["PC", "Mac", "PlayStation", "Xbox"],
    subcategories: ["Wireless", "Wired", "Lightweight", "MMO", "FPS", "Ergonomic"],
    techSpecs: ["Sensor Type", "Max DPI", "Polling Rate", "Weight", "Button Count"],
    sampleProducts: [
      {
        name: "Logitech G Pro X Superlight",
        price: 149.99,
        brand: "Logitech",
        rating: 4.9,
        features: ["25,600 DPI Hero sensor", "63g weight", "70-hour battery"],
        isFeatured: true,
        shortDescription: "Ultra-lightweight wireless gaming mouse"
      },
      {
        name: "Razer DeathAdder V3 Pro",
        price: 129.99,
        brand: "Razer",
        rating: 4.8,
        features: ["30,000 DPI Focus Pro sensor", "90-hour battery", "Wireless charging"],
        shortDescription: "Ergonomic wireless gaming mouse with charging dock"
      },
      {
        name: "SteelSeries Rival 650 Wireless",
        price: 119.99,
        originalPrice: 149.99,
        brand: "SteelSeries",
        rating: 4.6,
        features: ["Weight tuning system", "32,000 CPI sensor", "24+ hour battery"],
        shortDescription: "Customizable weight wireless gaming mouse"
      },
      {
        name: "Corsair M65 RGB Ultra",
        price: 69.99,
        brand: "Corsair",
        rating: 4.5,
        features: ["26,000 DPI sensor", "Sniper button", "Aluminum frame"],
        shortDescription: "FPS gaming mouse with sniper button"
      },
      {
        name: "Glorious Model O Wireless",
        price: 79.99,
        brand: "Glorious",
        rating: 4.7,
        features: ["69g weight", "Honeycomb shell", "71-hour battery"],
        isNew: true,
        shortDescription: "Ultra-light honeycomb wireless gaming mouse"
      },
      {
        name: "Finalmouse Starlight-12",
        price: 189.99,
        brand: "Finalmouse",
        rating: 4.8,
        features: ["47g weight", "Magnesium alloy", "PixArt 3360 sensor"],
        shortDescription: "Ultra-lightweight magnesium gaming mouse"
      }
    ]
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
    popularBrands: ["SteelSeries", "HyperX", "Corsair", "Razer", "Audio-Technica", "Sennheiser", "Astro", "Turtle Beach"],
    priceRange: { min: 39, max: 499 },
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    subcategories: ["Wireless", "Wired", "Open-back", "Closed-back", "USB", "3.5mm"],
    techSpecs: ["Driver Size", "Frequency Response", "Impedance", "Battery Life", "Connection Type"],
    sampleProducts: [
      {
        name: "SteelSeries Arctis Pro Wireless",
        price: 329.99,
        brand: "SteelSeries",
        rating: 4.8,
        features: ["Hi-Res audio", "Dual wireless", "20+ hour battery"],
        isFeatured: true,
        shortDescription: "Premium wireless gaming headset with hi-res audio"
      },
      {
        name: "HyperX Cloud III Wireless",
        price: 149.99,
        brand: "HyperX",
        rating: 4.7,
        features: ["2.4GHz wireless", "120-hour battery", "Memory foam"],
        isNew: true,
        shortDescription: "Long-lasting wireless gaming headset"
      },
      {
        name: "Corsair HS80 RGB Wireless",
        price: 129.99,
        brand: "Corsair",
        rating: 4.6,
        features: ["Dolby Audio 7.1", "20-hour battery", "Broadcast-grade mic"],
        shortDescription: "RGB wireless headset with premium audio"
      },
      {
        name: "Razer BlackShark V2 Pro",
        price: 179.99,
        originalPrice: 199.99,
        brand: "Razer",
        rating: 4.5,
        features: ["THX 7.1 Surround", "24-hour battery", "Titanium drivers"],
        shortDescription: "Esports wireless headset with THX audio"
      },
      {
        name: "Audio-Technica ATH-G1WL",
        price: 199.99,
        brand: "Audio-Technica",
        rating: 4.6,
        features: ["45mm drivers", "15-hour battery", "Professional audio"],
        shortDescription: "Audiophile wireless gaming headset"
      },
      {
        name: "Astro A50 Wireless",
        price: 299.99,
        brand: "Astro",
        rating: 4.4,
        features: ["Base station", "15+ hour battery", "MixAmp technology"],
        shortDescription: "Console-focused wireless gaming headset"
      }
    ]
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
    popularBrands: ["ASUS", "Acer", "BenQ", "Samsung", "LG", "MSI", "Alienware", "ViewSonic"],
    priceRange: { min: 199, max: 1899 },
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    subcategories: ["1080p", "1440p", "4K", "Ultrawide", "Curved", "Flat", "OLED", "IPS", "TN", "VA"],
    techSpecs: ["Resolution", "Refresh Rate", "Response Time", "Panel Type", "HDR Support"],
    sampleProducts: [
      {
        name: "ASUS ROG Swift PG279QM",
        price: 599.99,
        originalPrice: 699.99,
        brand: "ASUS",
        rating: 4.8,
        features: ["240Hz refresh rate", "1ms response time", "G-Sync compatible"],
        isFeatured: true,
        shortDescription: "27\" 1440p 240Hz gaming monitor"
      },
      {
        name: "Samsung Odyssey G7",
        price: 549.99,
        brand: "Samsung",
        rating: 4.6,
        features: ["240Hz curved", "1000R curvature", "QLED technology"],
        shortDescription: "32\" curved 1440p gaming monitor"
      },
      {
        name: "LG 27GP950-B",
        price: 699.99,
        brand: "LG",
        rating: 4.7,
        features: ["4K 144Hz", "1ms response", "HDR600"],
        isNew: true,
        shortDescription: "27\" 4K 144Hz gaming monitor"
      },
      {
        name: "BenQ ZOWIE XL2546K",
        price: 499.99,
        brand: "BenQ",
        rating: 4.5,
        features: ["360Hz refresh", "0.5ms response", "DyAc+ technology"],
        shortDescription: "24.5\" 1080p 360Hz esports monitor"
      },
      {
        name: "Acer Predator X34",
        price: 899.99,
        brand: "Acer",
        rating: 4.4,
        features: ["34\" ultrawide", "144Hz curved", "G-Sync compatible"],
        shortDescription: "Ultrawide curved gaming monitor"
      },
      {
        name: "Alienware AW3423DWF",
        price: 1099.99,
        brand: "Alienware",
        rating: 4.9,
        features: ["34\" QD-OLED", "165Hz", "HDR400"],
        isFeatured: true,
        shortDescription: "Premium OLED ultrawide gaming monitor"
      }
    ]
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
    popularBrands: ["Xbox", "PlayStation", "SCUF", "Battle Beaver", "PowerA", "8BitDo", "Razer", "Thrustmaster"],
    priceRange: { min: 59, max: 299 },
    compatibility: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    subcategories: ["Pro Controllers", "Wireless", "Wired", "Custom", "Arcade Sticks", "Racing Wheels"],
    techSpecs: ["Input Lag", "Battery Life", "Customization Options", "Build Quality", "Compatibility"],
    sampleProducts: [
      {
        name: "Xbox Elite Wireless Controller Series 2",
        price: 179.99,
        brand: "Xbox",
        rating: 4.6,
        features: ["40-hour battery", "Adjustable tension", "Hair triggers"],
        isFeatured: true,
        shortDescription: "Premium Xbox controller with pro features"
      },
      {
        name: "SCUF Reflex Pro",
        price: 229.99,
        brand: "SCUF",
        rating: 4.7,
        features: ["4 paddles", "Adaptive triggers", "Instant triggers"],
        shortDescription: "Pro controller for PlayStation 5"
      },
      {
        name: "Battle Beaver Elite",
        price: 199.99,
        brand: "Battle Beaver",
        rating: 4.8,
        features: ["Custom buttons", "Digital triggers", "Smart bumpers"],
        isNew: true,
        shortDescription: "Fully customizable pro controller"
      },
      {
        name: "8BitDo Pro 2",
        price: 49.99,
        brand: "8BitDo",
        rating: 4.5,
        features: ["Multi-platform", "20-hour battery", "Custom profiles"],
        shortDescription: "Retro-styled wireless controller"
      },
      {
        name: "Razer Wolverine V2 Pro",
        price: 249.99,
        brand: "Razer",
        rating: 4.4,
        features: ["6 remappable buttons", "Hair trigger mode", "RGB lighting"],
        shortDescription: "Wireless pro controller with RGB"
      },
      {
        name: "PowerA Fusion Pro 3",
        price: 99.99,
        brand: "PowerA",
        rating: 4.3,
        features: ["4 paddles", "3-way trigger locks", "Audio controls"],
        shortDescription: "Affordable wired pro controller"
      }
    ]
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
    popularBrands: ["Secretlab", "DXRacer", "Herman Miller", "Corsair", "Noblechairs", "IKEA", "Steelcase", "Razer"],
    priceRange: { min: 199, max: 1699 },
    compatibility: ["Universal"],
    subcategories: ["Gaming", "Office", "Racing Style", "Ergonomic", "Budget", "Premium"],
    techSpecs: ["Weight Capacity", "Recline Angle", "Material Type", "Warranty", "Assembly"],
    sampleProducts: [
      {
        name: "Secretlab TITAN Evo 2022",
        price: 519,
        brand: "Secretlab",
        rating: 4.8,
        features: ["Memory foam lumbar", "Cold-cure foam", "4-way armrests"],
        isFeatured: true,
        shortDescription: "Premium gaming chair with advanced ergonomics"
      },
      {
        name: "Herman Miller X Logitech G Embody",
        price: 1695,
        brand: "Herman Miller",
        rating: 4.9,
        features: ["Gaming-specific design", "Pixelated support", "12-year warranty"],
        shortDescription: "Professional gaming chair collaboration"
      },
      {
        name: "Corsair T3 RUSH",
        price: 329.99,
        brand: "Corsair",
        rating: 4.5,
        features: ["Fabric upholstery", "Wide seat", "Memory foam cushions"],
        shortDescription: "Comfortable fabric gaming chair"
      },
      {
        name: "DXRacer Master Series",
        price: 449.99,
        brand: "DXRacer",
        rating: 4.4,
        features: ["DMC technology", "4D armrests", "Aluminum base"],
        shortDescription: "Professional esports gaming chair"
      },
      {
        name: "Noblechairs Epic",
        price: 429.99,
        originalPrice: 479.99,
        brand: "Noblechairs",
        rating: 4.6,
        features: ["Real leather", "Cold foam", "60kg gas lift"],
        shortDescription: "Luxury real leather gaming chair"
      },
      {
        name: "Razer Enki Pro",
        price: 399.99,
        brand: "Razer",
        rating: 4.3,
        features: ["Built-in lumbar arch", "Reactive seat edge", "Ultra-soft cushions"],
        isNew: true,
        shortDescription: "Ergonomic gaming chair with built-in lumbar"
      }
    ]
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
    popularBrands: ["Corsair", "Razer", "SteelSeries", "Logitech", "Glorious", "HyperX", "Artisan", "Zowie"],
    priceRange: { min: 19, max: 199 },
    compatibility: ["Universal"],
    subcategories: ["RGB", "Extended", "Speed", "Control", "Cloth", "Hard", "Hybrid"],
    techSpecs: ["Surface Type", "Size", "Thickness", "RGB Zones", "Durability"],
    sampleProducts: [
      {
        name: "Corsair MM700 RGB Extended",
        price: 79.99,
        brand: "Corsair",
        rating: 4.6,
        features: ["3-zone RGB", "35\" x 15\"", "Built-in USB hub"],
        isFeatured: true,
        shortDescription: "RGB extended mousepad with USB passthrough"
      },
      {
        name: "Razer Firefly V2",
        price: 49.99,
        brand: "Razer",
        rating: 4.5,
        features: ["19-zone RGB", "Micro-textured surface", "Non-slip base"],
        shortDescription: "RGB hard gaming mousepad"
      },
      {
        name: "SteelSeries QcK Prism Cloth",
        price: 59.99,
        brand: "SteelSeries",
        rating: 4.4,
        features: ["2-zone RGB", "Never-fray edges", "Optimized sensor tracking"],
        shortDescription: "RGB cloth gaming mousepad"
      },
      {
        name: "Glorious 3XL Extended",
        price: 39.99,
        brand: "Glorious",
        rating: 4.7,
        features: ["48\" x 24\"", "Stitched edges", "3mm thick"],
        shortDescription: "Giant desk-sized gaming mousepad"
      },
      {
        name: "Artisan Hien Mid",
        price: 89.99,
        brand: "Artisan",
        rating: 4.8,
        features: ["Japanese craftsmanship", "Unique surface texture", "Various sizes"],
        isNew: true,
        shortDescription: "Premium Japanese gaming mousepad"
      },
      {
        name: "Logitech G640",
        price: 29.99,
        brand: "Logitech",
        rating: 4.3,
        features: ["Consistent surface texture", "Stable rubber base", "Moderate friction"],
        shortDescription: "Large cloth gaming mousepad"
      }
    ]
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
    popularBrands: ["Blue Yeti", "Audio-Technica", "Shure", "Rode", "HyperX", "Elgato", "Samson", "AKG"],
    priceRange: { min: 49, max: 599 },
    compatibility: ["PC", "Mac", "PlayStation", "Xbox"],
    subcategories: ["USB", "XLR", "Condenser", "Dynamic", "Lavalier", "Shotgun"],
    techSpecs: ["Polar Pattern", "Frequency Response", "Bit Rate", "Connection Type", "Monitoring"],
    sampleProducts: [
      {
        name: "Blue Yeti X",
        price: 169.99,
        brand: "Blue Yeti",
        rating: 4.7,
        features: ["4-capsule array", "Real-time LED meter", "Smart knob"],
        isFeatured: true,
        shortDescription: "Professional USB condenser microphone"
      },
      {
        name: "Shure SM7B",
        price: 399,
        brand: "Shure",
        rating: 4.9,
        features: ["Dynamic microphone", "Internal shock mount", "Pop filter"],
        shortDescription: "Broadcast-quality dynamic microphone"
      },
      {
        name: "Audio-Technica AT2020USB+",
        price: 149,
        brand: "Audio-Technica",
        rating: 4.6,
        features: ["Condenser microphone", "Side-address", "Headphone monitoring"],
        shortDescription: "Studio condenser USB microphone"
      },
      {
        name: "HyperX QuadCast S",
        price: 159.99,
        brand: "HyperX",
        rating: 4.5,
        features: ["RGB lighting", "Tap-to-mute", "4 polar patterns"],
        isNew: true,
        shortDescription: "RGB streaming microphone with tap-to-mute"
      },
      {
        name: "Elgato Wave:3",
        price: 149.99,
        brand: "Elgato",
        rating: 4.4,
        features: ["Capacitive mute button", "Mix software", "Pop filter"],
        shortDescription: "Premium USB condenser microphone for streaming"
      },
      {
        name: "Rode PodMic",
        price: 199,
        brand: "Rode",
        rating: 4.8,
        features: ["Broadcast dynamic", "Internal shock mounting", "Swing mount"],
        shortDescription: "Podcast-optimized dynamic microphone"
      }
    ]
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
    popularBrands: ["Logitech", "Creative", "Razer", "Corsair", "JBL", "Edifier", "Klipsch", "Audioengine"],
    priceRange: { min: 39, max: 399 },
    compatibility: ["PC", "Mac", "Mobile", "Gaming Consoles"],
    subcategories: ["2.0", "2.1", "5.1", "7.1", "Soundbars", "Bookshelf", "RGB"],
    techSpecs: ["Driver Size", "Power Output", "Frequency Response", "Connectivity", "RGB Zones"],
    sampleProducts: [
      {
        name: "Logitech G560 LIGHTSYNC",
        price: 199.99,
        originalPrice: 249.99,
        brand: "Logitech",
        rating: 4.5,
        features: ["RGB lighting sync", "240W peak power", "DTS:X Ultra"],
        isFeatured: true,
        shortDescription: "RGB gaming speakers with screen color sync"
      },
      {
        name: "Creative Pebble V3",
        price: 49.99,
        brand: "Creative",
        rating: 4.4,
        features: ["USB-C powered", "RGB lighting", "Minimalist design"],
        shortDescription: "Compact RGB desktop speakers"
      },
      {
        name: "Razer Nommo Pro",
        price: 499.99,
        brand: "Razer",
        rating: 4.6,
        features: ["THX certified", "Dolby Virtual Speaker", "Subwoofer included"],
        shortDescription: "Premium 2.1 gaming speaker system"
      },
      {
        name: "Edifier G2000",
        price: 79.99,
        brand: "Edifier",
        rating: 4.3,
        features: ["32W total power", "RGB lighting", "Multiple inputs"],
        isNew: true,
        shortDescription: "Budget RGB gaming speakers"
      },
      {
        name: "JBL Quantum Duo",
        price: 99.99,
        brand: "JBL",
        rating: 4.2,
        features: ["JBL QuantumSOUND", "RGB lighting", "Passive radiators"],
        shortDescription: "Gaming speakers with passive radiators"
      },
      {
        name: "Klipsch ProMedia 2.1",
        price: 149.99,
        brand: "Klipsch",
        rating: 4.7,
        features: ["THX certified", "200W total system power", "MicroTractrix Horn"],
        shortDescription: "THX-certified 2.1 computer speakers"
      }
    ]
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
    popularBrands: ["Corsair", "Razer", "NZXT", "Cooler Master", "Thermaltake", "Govee", "Nanoleaf", "Elgato"],
    priceRange: { min: 9, max: 299 },
    compatibility: ["Universal"],
    subcategories: ["Cable Management", "RGB Lighting", "Cooling", "Organization", "Streaming", "Desk Accessories"],
    techSpecs: ["Compatibility", "Installation", "Power Requirements", "Control Method", "Durability"],
    sampleProducts: [
      {
        name: "Corsair iCUE LS100 Smart Lighting Kit",
        price: 199.99,
        brand: "Corsair",
        rating: 4.6,
        features: ["Screen ambient lighting", "450 LEDs", "iCUE software"],
        isFeatured: true,
        shortDescription: "Smart RGB lighting strips for monitor backlighting"
      },
      {
        name: "Elgato Stream Deck MK.2",
        price: 149.99,
        brand: "Elgato",
        rating: 4.8,
        features: ["15 LCD keys", "Customizable actions", "Plugin ecosystem"],
        shortDescription: "Customizable control deck for streaming and gaming"
      },
      {
        name: "NZXT Puck",
        price: 19.99,
        brand: "NZXT",
        rating: 4.4,
        features: ["Magnetic mount", "Headset holder", "Cable management"],
        shortDescription: "Magnetic headset and cable holder"
      },
      {
        name: "Razer Base Station V2 Chroma",
        price: 69.99,
        brand: "Razer",
        rating: 4.3,
        features: ["RGB headset stand", "USB 3.0 hub", "7.1 surround sound"],
        shortDescription: "RGB headset stand with USB hub"
      },
      {
        name: "Govee Immersion TV Backlights",
        price: 89.99,
        brand: "Govee",
        rating: 4.5,
        features: ["Camera sync", "55+ scene modes", "App control"],
        isNew: true,
        shortDescription: "Smart TV backlighting that syncs with screen content"
      },
      {
        name: "Cooler Master Notepal X3",
        price: 24.99,
        brand: "Cooler Master",
        rating: 4.2,
        features: ["200mm fan", "Mesh surface", "Ergonomic design"],
        shortDescription: "Laptop cooling pad with large fan"
      },
      {
        name: "Cable Matters Under Desk Cable Tray",
        price: 34.99,
        brand: "Cable Matters",
        rating: 4.6,
        features: ["Under-desk mounting", "Expandable design", "Easy installation"],
        shortDescription: "Under-desk cable management solution"
      },
      {
        name: "Nanoleaf Shapes Hexagons",
        price: 199.99,
        brand: "Nanoleaf",
        rating: 4.4,
        features: ["Touch reactive", "Music sync", "Millions of colors"],
        shortDescription: "Modular smart light panels for wall decoration"
      }
    ]
  },
  {
    name: "Gaming Webcams",
    slug: "webcams",
    description: "High-definition streaming webcams with auto-focus, low-light correction, and professional features for content creation.",
    icon: "📹",
    image: "/images/categories/webcams.jpg",
    features: [
      "4K video recording",
      "Auto-focus technology",
      "Low-light correction",
      "Background removal",
      "60fps streaming",
      "Multiple mounting options"
    ],
    popularBrands: ["Logitech", "Razer", "Elgato", "OBSBOT", "AVerMedia", "Streamlabs", "Anker", "Microsoft"],
    priceRange: { min: 59, max: 399 },
    compatibility: ["PC", "Mac", "OBS", "Streamlabs"],
    subcategories: ["4K", "1080p", "Auto-tracking", "Wide-angle", "Streaming", "Conference"],
    techSpecs: ["Resolution", "Frame Rate", "Field of View", "Auto-focus", "Low Light Performance"],
    sampleProducts: [
      {
        name: "Logitech Brio 4K Pro",
        price: 199.99,
        brand: "Logitech",
        rating: 4.5,
        features: ["4K Ultra HD", "RightLight 3", "5x digital zoom"],
        isFeatured: true,
        shortDescription: "Professional 4K webcam with HDR"
      },
      {
        name: "Razer Kiyo Pro",
        price: 199.99,
        brand: "Razer",
        rating: 4.4,
        features: ["Adaptive light sensor", "1080p 60fps", "Uncompressed video"],
        shortDescription: "Professional streaming webcam with adaptive lighting"
      },
      {
        name: "Elgato Facecam",
        price: 199.99,
        brand: "Elgato",
        rating: 4.6,
        features: ["Uncompressed 1080p60", "Sony sensor", "Fixed focus"],
        shortDescription: "Studio-quality webcam for streamers"
      },
      {
        name: "OBSBOT Tiny 4K",
        price: 269,
        brand: "OBSBOT",
        rating: 4.7,
        features: ["AI auto-tracking", "4K 30fps", "Gesture control"],
        isNew: true,
        shortDescription: "AI-powered auto-tracking 4K webcam"
      },
      {
        name: "Logitech C922 Pro Stream",
        price: 99.99,
        originalPrice: 129.99,
        brand: "Logitech",
        rating: 4.3,
        features: ["1080p 30fps", "720p 60fps", "Background replacement"],
        shortDescription: "Popular streaming webcam with background removal"
      },
      {
        name: "AVerMedia PW315",
        price: 149.99,
        brand: "AVerMedia",
        rating: 4.2,
        features: ["1080p 60fps", "Auto-focus", "Built-in microphone"],
        shortDescription: "Professional webcam for streaming and conferences"
      }
    ]
  },
  {
    name: "VR Headsets",
    slug: "vr-headsets",
    description: "Immersive virtual reality headsets for gaming, featuring high-resolution displays, precise tracking, and comfortable ergonomics.",
    icon: "🥽",
    image: "/images/categories/vr-headsets.jpg",
    features: [
      "High-resolution displays",
      "6DOF tracking",
      "Hand tracking",
      "Wireless freedom",
      "Large game library",
      "Comfortable ergonomics"
    ],
    popularBrands: ["Meta", "HTC", "Valve", "Pico", "Varjo", "HP", "PlayStation", "Pimax"],
    priceRange: { min: 299, max: 1499 },
    compatibility: ["PC", "Standalone", "PlayStation"],
    subcategories: ["Standalone", "PC VR", "Console VR", "Mixed Reality", "Enterprise"],
    techSpecs: ["Display Resolution", "Refresh Rate", "Field of View", "Tracking Method", "IPD Range"],
    sampleProducts: [
      {
        name: "Meta Quest 3",
        price: 499.99,
        brand: "Meta",
        rating: 4.7,
        features: ["Mixed reality", "Snapdragon XR2 Gen 2", "128GB storage"],
        isFeatured: true,
        isNew: true,
        shortDescription: "Latest standalone VR headset with mixed reality"
      },
      {
        name: "Valve Index",
        price: 999,
        brand: "Valve",
        rating: 4.6,
        features: ["144Hz displays", "Knuckles controllers", "130° FOV"],
        shortDescription: "Premium PC VR headset with finger tracking"
      },
      {
        name: "PlayStation VR2",
        price: 549.99,
        brand: "PlayStation",
        rating: 4.5,
        features: ["4K HDR", "110° FOV", "Haptic feedback"],
        shortDescription: "Next-gen console VR for PlayStation 5"
      },
      {
        name: "HTC Vive Pro 2",
        price: 799,
        originalPrice: 1199,
        brand: "HTC",
        rating: 4.4,
        features: ["5K resolution", "120Hz refresh", "SteamVR tracking"],
        shortDescription: "High-end PC VR headset with 5K displays"
      },
      {
        name: "Pico 4 Enterprise",
        price: 649,
        brand: "Pico",
        rating: 4.3,
        features: ["Pancake lenses", "256GB storage", "Wi-Fi 6E"],
        shortDescription: "Business-focused standalone VR headset"
      },
      {
        name: "HP Reverb G2",
        price: 399.99,
        originalPrice: 599,
        brand: "HP",
        rating: 4.2,
        features: ["2160x2160 per eye", "Windows Mixed Reality", "Spatial audio"],
        shortDescription: "High-resolution Windows Mixed Reality headset"
      }
    ]
  }
];

export const getCategoryBySlug = (slug: string): CategoryData | undefined => {
  return categories.find(category => category.slug === slug);
};

export const getAllCategorySlugs = (): string[] => {
  return categories.map(category => category.slug);
};

export const getCategoryProducts = (slug: string): SampleProduct[] => {
  const category = getCategoryBySlug(slug);
  return category?.sampleProducts || [];
};

export const getFeaturedProducts = (): SampleProduct[] => {
  const featuredProducts: SampleProduct[] = [];
  
  categories.forEach(category => {
    if (category.sampleProducts) {
      const featured = category.sampleProducts.filter(product => product.isFeatured);
      featuredProducts.push(...featured);
    }
  });
  
  return featuredProducts;
};

export const getNewProducts = (): SampleProduct[] => {
  const newProducts: SampleProduct[] = [];
  
  categories.forEach(category => {
    if (category.sampleProducts) {
      const newItems = category.sampleProducts.filter(product => product.isNew);
      newProducts.push(...newItems);
    }
  });
  
  return newProducts;
};

export const getProductsByPriceRange = (minPrice: number, maxPrice: number): SampleProduct[] => {
  const products: SampleProduct[] = [];
  
  categories.forEach(category => {
    if (category.sampleProducts) {
      const filtered = category.sampleProducts.filter(
        product => product.price >= minPrice && product.price <= maxPrice
      );
      products.push(...filtered);
    }
  });
  
  return products;
};

export const getProductsByBrand = (brandName: string): SampleProduct[] => {
  const products: SampleProduct[] = [];
  
  categories.forEach(category => {
    if (category.sampleProducts) {
      const filtered = category.sampleProducts.filter(
        product => product.brand.toLowerCase() === brandName.toLowerCase()
      );
      products.push(...filtered);
    }
  });
  
  return products;
};

export const searchProducts = (query: string): SampleProduct[] => {
  const products: SampleProduct[] = [];
  const searchTerm = query.toLowerCase();
  
  categories.forEach(category => {
    if (category.sampleProducts) {
      const filtered = category.sampleProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.shortDescription.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.features.some(feature => feature.toLowerCase().includes(searchTerm))
      );
      products.push(...filtered);
    }
  });
  
  return products;
};

// Helper function to get all brands across categories
export const getAllBrands = (): string[] => {
  const brands = new Set<string>();
  
  categories.forEach(category => {
    category.popularBrands.forEach(brand => brands.add(brand));
    if (category.sampleProducts) {
      category.sampleProducts.forEach(product => brands.add(product.brand));
    }
  });
  
  return Array.from(brands).sort();
};

// Helper function to get price statistics
export const getPriceStats = () => {
  let minPrice = Infinity;
  let maxPrice = 0;
  let totalProducts = 0;
  let totalValue = 0;
  
  categories.forEach(category => {
    if (category.sampleProducts) {
      category.sampleProducts.forEach(product => {
        minPrice = Math.min(minPrice, product.price);
        maxPrice = Math.max(maxPrice, product.price);
        totalProducts++;
        totalValue += product.price;
      });
    }
  });
  
  return {
    minPrice: minPrice === Infinity ? 0 : minPrice,
    maxPrice,
    averagePrice: totalProducts > 0 ? totalValue / totalProducts : 0,
    totalProducts
  };
};