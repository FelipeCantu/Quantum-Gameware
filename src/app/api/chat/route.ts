import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getBrands } from '@/sanity/lib/queries';
import { categories } from '@/data/categories';

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid request: messages array is required' },
        { status: 400 }
      );
    }

    // Check for API keys - try Gemini first (FREE), then OpenAI
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    // Fetch real product and brand data from Sanity
    const [products, brands] = await Promise.all([
      getProducts(),
      getBrands()
    ]);

    // Get product categories
    const categories = [...new Set(products.map(p => p.category).filter(Boolean))];

    // Get brand names and details
    const brandNames = brands.map(b => b.name).join(', ');
    const brandDetails = brands.slice(0, 10).map(b =>
      `${b.name}${b.description ? ': ' + b.description.substring(0, 100) : ''}`
    ).join('\n');

    // Get comprehensive product information
    const featuredProducts = products
      .filter(p => p.isFeatured)
      .slice(0, 5)
      .map(p => `${p.name} ($${p.price})${p.description ? ' - ' + p.description.substring(0, 60) + '...' : ''}`)
      .join('\n');

    // Product statistics
    const priceRange = {
      min: Math.min(...products.map(p => p.price)),
      max: Math.max(...products.map(p => p.price))
    };

    // Category breakdown
    const categoryBreakdown = categories.map(cat => {
      const count = products.filter(p => p.category === cat).length;
      return `${cat} (${count} items)`;
    }).join(', ');

    // Popular products by category
    const productsByCategory = categories.slice(0, 5).map(cat => {
      const categoryProducts = products
        .filter(p => p.category === cat)
        .slice(0, 3)
        .map(p => `  • ${p.name} - $${p.price}`)
        .join('\n');
      return `${cat}:\n${categoryProducts}`;
    }).join('\n\n');

    // System prompt to guide the AI assistant with REAL store data
    const systemPrompt = {
      role: 'system',
      content: `You are an expert customer service AI assistant for Quantum Gameware, a premium online gaming accessories store. You have deep knowledge of gaming products, brands, and industry trends.

CORE RESPONSIBILITIES:
- Help customers find the perfect gaming products for their needs
- Provide detailed product recommendations based on use case (competitive gaming, streaming, casual play)
- Answer questions about products, specifications, compatibility, shipping, returns, and orders
- Compare products and explain differences between similar items
- Suggest complementary products and gaming setups
- Provide friendly, professional, knowledgeable responses
- Guide users through the shopping experience

===== COMPREHENSIVE STORE INFORMATION =====

📦 SHIPPING & RETURNS POLICY:
- FREE shipping on all orders over $50 (US domestic)
- Standard shipping: 5-7 business days
- Express shipping: 2-3 business days (additional fee)
- International shipping available (contact for rates)
- 30-day hassle-free return policy
- Easy returns - no questions asked
- Full refund or exchange available
- Manufacturer warranty support on all products
- Damaged/defective items replaced immediately

💳 PAYMENT & SECURITY:
- Secure checkout with encryption
- Major credit cards accepted
- PayPal and other payment methods available
- Order tracking provided via email
- Customer account system for order history

🏷️ BRANDS WE CARRY (${brands.length} total):
${brandDetails || brandNames}

📁 PRODUCT CATALOG:
Total Products: ${products.length}
Price Range: $${priceRange.min} - $${priceRange.max}

Categories Available:
${categoryBreakdown}

SAMPLE PRODUCTS BY CATEGORY:
${productsByCategory}

⭐ FEATURED PRODUCTS:
${featuredProducts}

🎮 TARGET CUSTOMERS:
- Competitive gamers (FPS, MOBA, Battle Royale, etc.)
- Streamers and content creators
- PC gamers (custom builds, RGB setups)
- Console gamers (PlayStation, Xbox, Nintendo Switch)
- Casual gamers looking for quality gear
- Budget-conscious buyers seeking value
- Professional esports players
- Gaming enthusiasts building setups

===== WEBSITE FEATURES & PAGES =====

🔍 SEARCH & FILTERING:
- Advanced product search available on /products
- Filter by category, brand, price range
- Sort by price, popularity, newest
- Quick view product details

❤️ WISHLIST SYSTEM:
- Save favorite products for later at /wishlist
- Requires user account/sign-in
- Persistent across sessions
- Click heart icon on products to add
- View and manage saved items anytime

👤 ACCOUNT FEATURES (/account):
- View order history and tracking
- Manage shipping addresses
- Update profile information
- Track order status
- Access past invoices

🛍️ SHOPPING FEATURES:
- Product pages with detailed specs and images
- Add to cart and checkout
- Guest checkout or account creation
- Quantity selection
- Related products suggestions

📞 SUPPORT & CONTACT (/contact):
- Email: support@quantumgameware.com
- Contact form available
- FAQ section
- Live chat (this assistant)

===== RESPONSE STRATEGY =====

BE SPECIFIC & HELPFUL:
- Always try to answer the user's exact question
- Provide product names, prices, and key specs when relevant
- Explain differences between similar products
- Suggest alternatives if what they want isn't available
- Consider their use case (streaming, competitive play, casual gaming)

USE CASE MATCHING:
- For streamers: Suggest products with good aesthetics, RGB, quality audio
- For competitive: Emphasize low latency, precision, durability, pro-level features
- For casual: Balance quality and value, emphasize ease of use
- For budget: Highlight best value options, mention free shipping threshold

PRODUCT RECOMMENDATIONS:
- Match products to user needs (gaming style, budget, platform)
- Explain WHY you're recommending something
- Mention 2-3 specific products when possible
- Include price points
- Highlight key features that match their needs

LINK FORMATTING:
When suggesting users visit pages, format links as: [Link Text](URL)
IMPORTANT: When mentioning specific product categories (keyboards, mice, headsets, etc.), ALWAYS use the category-specific page links (e.g., /categories/keyboards NOT /products).

Essential Links:
- [Browse Products](/products) - Main catalog
- [View Categories](/categories) - Browse by category
- [My Account](/account) - Orders & profile
- [Wishlist](/wishlist) - Saved items
- [Contact Support](/contact) - Help center
- [Shopping Cart](/cart) - View cart
- [My Orders](/orders) - Order history
- [Help Center](/help) - FAQs and support
- [Shipping Info](/shipping) - Shipping details
- [Returns](/returns) - Return policy

Category Links (use these specific category pages):
- [Gaming Keyboards](/categories/keyboards) - Mechanical and gaming keyboards
- [Gaming Mice](/categories/mice) - High-precision gaming mice
- [Gaming Headsets](/categories/headsets) - Immersive gaming headsets
- [Gaming Monitors](/categories/monitors) - High-refresh gaming monitors
- [Gaming Controllers](/categories/controllers) - Pro gaming controllers
- [Gaming Chairs](/categories/chairs) - Ergonomic gaming chairs
- [Mouse Pads](/categories/mousepads) - Premium gaming mouse pads
- [Gaming Microphones](/categories/microphones) - Professional streaming mics
- [Gaming Speakers](/categories/speakers) - High-quality gaming speakers
- [Gaming Accessories](/categories/accessories) - Essential gaming accessories
- [Gaming Webcams](/categories/webcams) - HD streaming webcams
- [VR Headsets](/categories/vr-headsets) - Immersive VR gaming
- Browse all categories at /categories
- Individual products at /products
- Product details at /products/[slug]

RESPONSE STYLE:
- Professional but conversational
- Enthusiastic about gaming
- Use gaming terminology naturally
- Keep responses focused (2-4 sentences for simple questions, longer for complex ones)
- Use bullet points for feature lists
- Include relevant emojis sparingly (🎮 🖱️ ⌨️ 🎧)
- Always try to be helpful, never dismissive

HANDLING UNCERTAINTY:
- If unsure about specific product specs: Suggest checking the product page or contacting support
- If asked about order status: Direct to [My Account](/account) or [Contact Support](/contact)
- If product not in catalog: Suggest similar alternatives or recommend checking back

Remember: You're a gaming expert helping gamers find their perfect gear. Be knowledgeable, helpful, and passionate about gaming!`
    };

    // Try Google Gemini first (FREE with generous limits)
    if (geminiKey) {
      try {
        const geminiMessages = messages.map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                { role: 'user', parts: [{ text: systemPrompt.content }] },
                ...geminiMessages
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 500,
              }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const assistantMessage = data.candidates?.[0]?.content?.parts?.[0]?.text;

          if (assistantMessage) {
            return NextResponse.json({ message: assistantMessage });
          }
        }
      } catch (geminiError) {
        console.log('Gemini error, trying OpenAI or fallback');
      }
    }

    // Try OpenAI as backup
    if (openaiKey) {
      try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [systemPrompt, ...messages],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const assistantMessage = data.choices?.[0]?.message?.content;

          if (assistantMessage) {
            return NextResponse.json({ message: assistantMessage });
          }
        }
      } catch (openaiError) {
        console.log('OpenAI error, using fallback');
      }
    }

    // FALLBACK: Smart keyword-based responses using real store data
    const lastMessage = messages[messages.length - 1]?.content?.toLowerCase() || '';

    // Helper function to search products
    const searchProducts = (keywords: string[]) => {
      return products.filter(p => {
        const searchText = `${p.name} ${p.description || ''} ${p.category || ''}`.toLowerCase();
        return keywords.some(keyword => searchText.includes(keyword));
      });
    };

    // Shipping questions
    if (lastMessage.includes('ship') || lastMessage.includes('deliver')) {
      return NextResponse.json({
        message: `We offer free shipping on orders over $50! 📦\n\nShipping times:\n• Standard: 5-7 business days\n• Express: 2-3 business days (additional fee)\n\nReady to shop? [Browse Products](/products)`
      });
    }

    // Return/warranty questions
    if (lastMessage.includes('return') || lastMessage.includes('warranty') || lastMessage.includes('refund')) {
      return NextResponse.json({
        message: `We have a 30-day return policy! 🔄\n\n• Easy returns, no questions asked\n• Full refund or exchange\n• Warranty support on all products\n\nNeed help? [Contact Support](/contact)`
      });
    }

    // Brand questions
    if (lastMessage.includes('brand') || lastMessage.includes('carry')) {
      return NextResponse.json({
        message: `We carry the best gaming brands! 🎮\n\n${brandNames || 'Razer, Logitech, Corsair, SteelSeries, HyperX, and more'}\n\nExplore our collection: [Browse Products](/products) | [View by Category](/categories)`
      });
    }

    // Product recommendations
    if (lastMessage.includes('headset') || lastMessage.includes('headphone')) {
      const headsets = products.filter(p =>
        p.category?.toLowerCase().includes('headset') ||
        p.name?.toLowerCase().includes('headset')
      ).slice(0, 3);

      if (headsets.length > 0) {
        const headsetList = headsets.map(h => `• ${h.name} - $${h.price}`).join('\n');
        return NextResponse.json({
          message: `Great choice! Here are some popular headsets:\n\n${headsetList}\n\n[View All Headsets](/categories/headsets) 🎧`
        });
      }
    }

    if (lastMessage.includes('keyboard')) {
      const keyboards = products.filter(p =>
        p.category?.toLowerCase().includes('keyboard') ||
        p.name?.toLowerCase().includes('keyboard')
      ).slice(0, 3);

      if (keyboards.length > 0) {
        const keyboardList = keyboards.map(k => `• ${k.name} - $${k.price}`).join('\n');
        return NextResponse.json({
          message: `Here are some awesome keyboards:\n\n${keyboardList}\n\n[Browse All Keyboards](/categories/keyboards) ⌨️`
        });
      }
    }

    if (lastMessage.includes('mouse') || lastMessage.includes('mice')) {
      const mice = products.filter(p =>
        p.category?.toLowerCase().includes('mouse') ||
        p.name?.toLowerCase().includes('mouse')
      ).slice(0, 3);

      if (mice.length > 0) {
        const miceList = mice.map(m => `• ${m.name} - $${m.price}`).join('\n');
        return NextResponse.json({
          message: `Check out these gaming mice:\n\n${miceList}\n\n[See All Mice](/categories/mice) 🖱️`
        });
      }
    }

    // Monitor questions
    if (lastMessage.includes('monitor') || lastMessage.includes('screen') || lastMessage.includes('display')) {
      const monitors = products.filter(p =>
        p.category?.toLowerCase().includes('monitor') ||
        p.name?.toLowerCase().includes('monitor')
      ).slice(0, 3);

      if (monitors.length > 0) {
        const monitorList = monitors.map(m => `• ${m.name} - $${m.price}`).join('\n');
        return NextResponse.json({
          message: `Check out these gaming monitors:\n\n${monitorList}\n\n[View All Monitors](/categories/monitors) 🖥️`
        });
      }
    }

    // Controller questions
    if (lastMessage.includes('controller') || lastMessage.includes('gamepad')) {
      const controllers = products.filter(p =>
        p.category?.toLowerCase().includes('controller') ||
        p.name?.toLowerCase().includes('controller')
      ).slice(0, 3);

      if (controllers.length > 0) {
        const controllerList = controllers.map(c => `• ${c.name} - $${c.price}`).join('\n');
        return NextResponse.json({
          message: `Here are some great controllers:\n\n${controllerList}\n\n[View All Controllers](/categories/controllers) 🎮`
        });
      }
    }

    // Chair questions
    if (lastMessage.includes('chair') || lastMessage.includes('seat')) {
      return NextResponse.json({
        message: `Comfortable gaming is important! We have ergonomic gaming chairs that support long gaming sessions.\n\n[Browse Gaming Chairs](/categories/chairs) 💺`
      });
    }

    // Microphone questions
    if (lastMessage.includes('microphone') || lastMessage.includes('mic')) {
      return NextResponse.json({
        message: `Great communication is key! We have professional gaming and streaming microphones.\n\n[View Gaming Microphones](/categories/microphones) 🎙️`
      });
    }

    // Webcam questions
    if (lastMessage.includes('webcam') || lastMessage.includes('camera')) {
      return NextResponse.json({
        message: `Perfect for streaming! Check out our HD gaming webcams.\n\n[Browse Gaming Webcams](/categories/webcams) 📹`
      });
    }

    // VR questions
    if (lastMessage.includes('vr') || lastMessage.includes('virtual reality') || lastMessage.includes('headset') && lastMessage.includes('vr')) {
      return NextResponse.json({
        message: `Immersive VR gaming! Explore our VR headsets for the ultimate gaming experience.\n\n[View VR Headsets](/categories/vr-headsets) 🥽`
      });
    }

    // Featured/deals
    if (lastMessage.includes('deal') || lastMessage.includes('sale') || lastMessage.includes('featured') || lastMessage.includes('popular')) {
      return NextResponse.json({
        message: `Our featured products right now:\n\n${featuredProducts}\n\nPlus, remember - FREE shipping on orders over $50! 🎉\n\n[Shop Now](/products)`
      });
    }

    // Categories
    if (lastMessage.includes('categories') || lastMessage.includes('what do you sell')) {
      return NextResponse.json({
        message: `We sell quality gaming gear at great prices! 🎮\n\nCategories: ${categories.join(', ')}\n\nWe have ${products.length} products available.\n\n[Browse Catalog](/products)`
      });
    }

    // Price questions
    if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('cheap') || lastMessage.includes('budget')) {
      return NextResponse.json({
        message: `We focus on quality gaming gear at affordable prices! 💰\n\n• Products from budget-friendly to premium\n• Free shipping over $50\n• Price range varies by category\n\nLet me know what you're looking for!\n\n[View Products](/products)`
      });
    }

    // Wishlist questions
    if (lastMessage.includes('wishlist') || lastMessage.includes('saved') || lastMessage.includes('favorite')) {
      return NextResponse.json({
        message: `You can save items to your wishlist for later! ❤️\n\nJust click the heart icon on any product to add it.\n\n[View Your Wishlist](/wishlist)`
      });
    }

    // Account/Order questions
    if (lastMessage.includes('order') || lastMessage.includes('account') || lastMessage.includes('track')) {
      return NextResponse.json({
        message: `You can track your orders and manage your account here:\n\n[View Account & Orders](/account)\n\nNeed specific order help? [Contact Support](/contact)`
      });
    }

    // Comparison questions
    if (lastMessage.includes('vs') || lastMessage.includes('versus') || lastMessage.includes('compare') || lastMessage.includes('difference between')) {
      return NextResponse.json({
        message: `I'd be happy to help you compare products! 🤔\n\nTo give you the best comparison, could you tell me:\n• Which specific products or types you're considering?\n• Your main use case (competitive gaming, streaming, casual play)?\n• Your budget range?\n\nYou can also [Browse Products](/products) to compare specs side-by-side!`
      });
    }

    // Setup/recommendation questions
    if (lastMessage.includes('setup') || lastMessage.includes('recommend') || lastMessage.includes('best') || lastMessage.includes('suggestion')) {
      const suggestions = products.filter(p => p.isFeatured).slice(0, 4);
      if (suggestions.length > 0) {
        const suggestionList = suggestions.map(s => `• ${s.name} - $${s.price}`).join('\n');
        return NextResponse.json({
          message: `Great question! Here are some top-rated products to consider:\n\n${suggestionList}\n\nTell me more about your needs and I can give you personalized recommendations!\n\n[Explore Full Catalog](/products)`
        });
      }
    }

    // Compatibility questions
    if (lastMessage.includes('compatible') || lastMessage.includes('work with') || lastMessage.includes('support')) {
      return NextResponse.json({
        message: `Great question about compatibility! 🔌\n\nMost of our products are cross-platform compatible (PC, PlayStation, Xbox, Switch). For specific compatibility:\n\n• Check the product page for detailed specs\n• Look for platform icons\n• Check manufacturer specifications\n\nNeed help finding something specific? [Browse Products](/products) or [Contact Support](/contact)`
      });
    }

    // RGB/Lighting questions
    if (lastMessage.includes('rgb') || lastMessage.includes('light') || lastMessage.includes('glow') || lastMessage.includes('color')) {
      const rgbProducts = searchProducts(['rgb', 'light', 'lighting']).slice(0, 3);
      if (rgbProducts.length > 0) {
        const rgbList = rgbProducts.map(p => `• ${p.name} - $${p.price}`).join('\n');
        return NextResponse.json({
          message: `Love the RGB vibe! 🌈 Here are some products with great lighting:\n\n${rgbList}\n\nMost RGB products include customizable software for colors and effects!\n\n[View All RGB Products](/products)`
        });
      }
    }

    // Wireless questions
    if (lastMessage.includes('wireless') || lastMessage.includes('bluetooth') || lastMessage.includes('cordless')) {
      const wirelessProducts = searchProducts(['wireless', 'bluetooth']).slice(0, 3);
      if (wirelessProducts.length > 0) {
        const wirelessList = wirelessProducts.map(p => `• ${p.name} - $${p.price}`).join('\n');
        return NextResponse.json({
          message: `We have great wireless options! 🔋\n\n${wirelessList}\n\nWireless gaming gear offers freedom of movement with low latency!\n\n[Shop Wireless Products](/products)`
        });
      }
    }

    // Professional/esports questions
    if (lastMessage.includes('pro') || lastMessage.includes('professional') || lastMessage.includes('esports') || lastMessage.includes('competitive')) {
      return NextResponse.json({
        message: `Looking for pro-level gear! 🏆\n\nFor competitive gaming, consider:\n• Low-latency peripherals\n• Precise sensors and switches\n• Durable build quality\n• Tournament-approved gear\n\nBrands like ${brandNames.split(',').slice(0, 3).join(', ')} are trusted by esports pros!\n\n[Browse Pro Gaming Gear](/products)`
      });
    }

    // Streaming questions
    if (lastMessage.includes('stream') || lastMessage.includes('content') || lastMessage.includes('youtube') || lastMessage.includes('twitch')) {
      return NextResponse.json({
        message: `Perfect for content creation! 🎥\n\nFor streaming, you'll want:\n• High-quality microphone (many headsets have great mics)\n• Good audio quality for monitoring\n• RGB lighting for that professional look\n• Comfortable gear for long streams\n\nCheck out headsets and accessories perfect for creators!\n\n[Browse Streaming Gear](/products)`
      });
    }

    // Durability/quality questions
    if (lastMessage.includes('durable') || lastMessage.includes('quality') || lastMessage.includes('last') || lastMessage.includes('build')) {
      return NextResponse.json({
        message: `Quality matters! 💪\n\nAll our products come with:\n• Manufacturer warranty\n• 30-day return policy\n• Quality assurance from trusted brands\n\nWe stock ${brandNames.split(',').slice(0, 4).join(', ')}, and more - all known for durability!\n\n[Browse Products](/products)`
      });
    }

    // Gaming platform specific
    if (lastMessage.includes('pc') || lastMessage.includes('computer')) {
      return NextResponse.json({
        message: `PC gaming setup! 💻\n\nWe have everything you need:\n• Mechanical keyboards with customizable keys\n• High-DPI gaming mice\n• Premium headsets with surround sound\n• RGB accessories\n\nMost products also work with consoles!\n\n[Browse PC Gaming Gear](/products)`
      });
    }

    if (lastMessage.includes('playstation') || lastMessage.includes('ps5') || lastMessage.includes('ps4')) {
      const psProducts = searchProducts(['playstation', 'ps5', 'ps4', 'console']).slice(0, 3);
      if (psProducts.length > 0) {
        const psList = psProducts.map(p => `• ${p.name} - $${p.price}`).join('\n');
        return NextResponse.json({
          message: `PlayStation compatible gear! 🎮\n\n${psList}\n\nLook for the PlayStation compatibility badge on product pages!\n\n[Shop PlayStation Gear](/products)`
        });
      }
    }

    if (lastMessage.includes('xbox') || lastMessage.includes('series x') || lastMessage.includes('series s')) {
      const xboxProducts = searchProducts(['xbox', 'console']).slice(0, 3);
      if (xboxProducts.length > 0) {
        const xboxList = xboxProducts.map(p => `• ${p.name} - $${p.price}`).join('\n');
        return NextResponse.json({
          message: `Xbox compatible gear! 🎮\n\n${xboxList}\n\nCheck product pages for Series X|S and Xbox One compatibility!\n\n[Shop Xbox Gear](/products)`
        });
      }
    }

    // How to use site features
    if (lastMessage.includes('how to') || lastMessage.includes('how do i') || lastMessage.includes('where can i')) {
      return NextResponse.json({
        message: `Happy to help you navigate! 🗺️\n\nQuick guide:\n• [Browse Products](/products) - All products\n• [Categories](/categories) - Shop by category\n• [My Account](/account) - Track orders, manage info\n• [Wishlist](/wishlist) - Save favorites (heart icon on products)\n• [Shopping Cart](/cart) - View cart & checkout\n• [Contact](/contact) - Get support\n\nWhat would you like to do?`
      });
    }

    // Default helpful response
    return NextResponse.json({
      message: `Hi! I'm your Quantum Gameware gaming expert! 🎮\n\nI can help you with:\n• Product recommendations (headsets, keyboards, mice, controllers)\n• Gaming setup advice (PC, console, streaming)\n• Comparisons and compatibility\n• Shipping, returns, and orders\n• Finding the best gear for your budget\n\nWe have ${products.length} products from ${brandNames.split(',').slice(0, 3).join(', ')}, and more!\n\nWhat can I help you find today?\n\n[Browse Products](/products)`
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      message: `Hi! I'm your Quantum Gameware assistant! 🎮\n\nWe carry quality gaming products with free shipping over $50.\n\n[Browse Products](/products) | [Contact Us](/contact)`
    }, { status: 200 });
  }
}
