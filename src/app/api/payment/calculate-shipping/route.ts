// src/app/api/payments/calculate-shipping/route.ts - Shipping Calculator
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { items, shippingAddress, shippingMethod } = body;

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Items are required' },
        { status: 400 }
      );
    }

    // Calculate shipping based on various factors
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.price * item.quantity), 0
    );

    const totalWeight = items.reduce((sum: number, item: any) => 
      sum + ((item.weight || 1) * item.quantity), 0
    );

    const itemCount = items.reduce((sum: number, item: any) => 
      sum + item.quantity, 0
    );

    // Shipping calculation logic
    let shippingCost = 0;
    let estimatedDays = 5;

    // Free shipping threshold
    if (subtotal >= 100) {
      shippingCost = 0;
      estimatedDays = 5;
    } else {
      // Base shipping rates
      switch (shippingMethod) {
        case 'standard':
          shippingCost = 9.99;
          estimatedDays = 5;
          break;
        case 'express':
          shippingCost = 19.99;
          estimatedDays = 2;
          break;
        case 'overnight':
          shippingCost = 39.99;
          estimatedDays = 1;
          break;
        default:
          shippingCost = 9.99;
          estimatedDays = 5;
      }

      // Weight-based adjustments
      if (totalWeight > 10) {
        shippingCost += Math.ceil((totalWeight - 10) / 5) * 5;
      }

      // International shipping
      if (shippingAddress?.country && shippingAddress.country !== 'US') {
        shippingCost += 25;
        estimatedDays += 5;
      }
    }

    const shippingOptions = [
      {
        id: 'standard',
        name: 'Standard Shipping',
        description: `Delivery in ${estimatedDays} business days`,
        cost: shippingCost,
        estimatedDays: estimatedDays,
        selected: shippingMethod === 'standard' || !shippingMethod
      },
      {
        id: 'express',
        name: 'Express Shipping',
        description: 'Delivery in 2 business days',
        cost: subtotal >= 100 ? 14.99 : 19.99,
        estimatedDays: 2,
        selected: shippingMethod === 'express'
      },
      {
        id: 'overnight',
        name: 'Overnight Shipping',
        description: 'Next business day delivery',
        cost: subtotal >= 100 ? 29.99 : 39.99,
        estimatedDays: 1,
        selected: shippingMethod === 'overnight'
      }
    ];

    return NextResponse.json({
      shippingOptions,
      freeShippingThreshold: 100,
      currentSubtotal: subtotal,
      qualifiesForFreeShipping: subtotal >= 100
    });

  } catch (error) {
    console.error('❌ Shipping calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate shipping' },
      { status: 500 }
    );
  }
}