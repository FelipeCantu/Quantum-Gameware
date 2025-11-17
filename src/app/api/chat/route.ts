import { NextRequest, NextResponse } from 'next/server';
import { getProducts, getBrands } from '@/sanity/lib/queries';

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

    // Get brand names
    const brandNames = brands.map(b => b.name).join(', ');

    // Get sample products for context
    const featuredProducts = products
      .filter(p => p.isFeatured)
      .slice(0, 5)
      .map(p => `${p.name} ($${p.price})`)
      .join(', ');

    // System prompt to guide the AI assistant with REAL store data
    const systemPrompt = {
      role: 'system',
      content: `You are a helpful customer service assistant for Quantum Gameware, an online gaming accessories store.

Your role is to:
- Help customers find the right gaming products
- Answer questions about products, shipping, returns, and orders
- Provide friendly, professional, and helpful responses
- Be concise but informative
- If you don't know something specific about an order or product detail, suggest they contact support at support@quantumgameware.com

IMPORTANT STORE INFORMATION:

📦 Shipping & Returns:
- Free shipping on orders over $50
- Standard shipping: 5-7 business days
- Express shipping available
- 30-day return policy
- Easy returns and warranty support

🏷️ Brands We Carry:
${brandNames || 'Razer, Logitech, Corsair, SteelSeries, HyperX, and more'}

📁 Product Categories:
${categories.join(', ') || 'Headsets, Keyboards, Mice, Controllers, Accessories'}

⭐ Featured Products:
${featuredProducts || 'Check our website for current featured items'}

💰 Total Products Available: ${products.length}

🎮 Target Audience:
- Gamers (casual and competitive)
- Streamers and content creators
- PC and console gamers
- Budget-conscious buyers looking for quality

RESPONSE GUIDELINES:
- Keep responses under 3-4 sentences when possible
- Use bullet points for lists
- Be enthusiastic about gaming gear
- Mention specific products when relevant
- Direct users to browse categories or use search for specific items
- If asked about specific product details not in your knowledge, suggest they check the product page or contact support

Keep responses friendly, helpful, and gaming-focused. Use casual but professional language.`
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

    // Shipping questions
    if (lastMessage.includes('ship') || lastMessage.includes('deliver')) {
      return NextResponse.json({
        message: `We offer free shipping on orders over $50! 📦\n\nShipping times:\n• Standard: 5-7 business days\n• Express: 2-3 business days (additional fee)\n\nIs there anything specific you'd like to know about shipping?`
      });
    }

    // Return/warranty questions
    if (lastMessage.includes('return') || lastMessage.includes('warranty') || lastMessage.includes('refund')) {
      return NextResponse.json({
        message: `We have a 30-day return policy! 🔄\n\n• Easy returns, no questions asked\n• Full refund or exchange\n• Warranty support on all products\n\nNeed help with a return? Contact us at support@quantumgameware.com`
      });
    }

    // Brand questions
    if (lastMessage.includes('brand') || lastMessage.includes('carry')) {
      return NextResponse.json({
        message: `We carry the best gaming brands! 🎮\n\n${brandNames || 'Razer, Logitech, Corsair, SteelSeries, HyperX, and more'}\n\nLooking for something specific? Check out our brands page or search for a product!`
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
          message: `Great choice! Here are some popular headsets:\n\n${headsetList}\n\nBrowse all headsets on our products page! 🎧`
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
          message: `Here are some awesome keyboards:\n\n${keyboardList}\n\nCheck out all keyboards in our products section! ⌨️`
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
          message: `Check out these gaming mice:\n\n${miceList}\n\nView all mice in our catalog! 🖱️`
        });
      }
    }

    // Featured/deals
    if (lastMessage.includes('deal') || lastMessage.includes('sale') || lastMessage.includes('featured') || lastMessage.includes('popular')) {
      return NextResponse.json({
        message: `Our featured products right now:\n\n${featuredProducts}\n\nPlus, remember - FREE shipping on orders over $50! 🎉`
      });
    }

    // Categories
    if (lastMessage.includes('categories') || lastMessage.includes('what do you sell')) {
      return NextResponse.json({
        message: `We sell quality gaming gear at great prices! 🎮\n\nCategories: ${categories.join(', ')}\n\nWe have ${products.length} products available. Browse our catalog to find exactly what you need!`
      });
    }

    // Price questions
    if (lastMessage.includes('price') || lastMessage.includes('cost') || lastMessage.includes('cheap') || lastMessage.includes('budget')) {
      return NextResponse.json({
        message: `We focus on quality gaming gear at affordable prices! 💰\n\n• Products from budget-friendly to premium\n• Free shipping over $50\n• Price range varies by category\n\nLet me know what you're looking for and I can help you find something in your budget!`
      });
    }

    // Default helpful response
    return NextResponse.json({
      message: `Hi! I'm here to help you find the perfect gaming gear! 🎮\n\nI can help you with:\n• Product recommendations\n• Shipping & returns info\n• Brand questions\n• Finding deals\n\nWe have ${products.length} products from brands like ${brandNames.split(',').slice(0, 3).join(', ')}, and more!\n\nWhat are you looking for today?`
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      message: `Hi! I'm your Quantum Gameware assistant! 🎮\n\nWe carry ${products.length} quality gaming products with free shipping over $50.\n\nHow can I help you today?`
    }, { status: 200 });
  }
}
