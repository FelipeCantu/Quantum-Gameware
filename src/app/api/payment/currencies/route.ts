// src/app/api/payments/currencies/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supportedCurrencies = {
      USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        decimal_places: 2,
        supported_countries: ['US', 'CA']
      },
      EUR: {
        code: 'EUR',
        symbol: '€',
        name: 'Euro',
        decimal_places: 2,
        supported_countries: ['DE', 'FR', 'IT', 'ES', 'NL']
      },
      GBP: {
        code: 'GBP',
        symbol: '£',
        name: 'British Pound',
        decimal_places: 2,
        supported_countries: ['GB']
      },
      CAD: {
        code: 'CAD',
        symbol: 'C',
        name: 'Canadian Dollar',
        decimal_places: 2,
        supported_countries: ['CA']
      }
    };

    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    if (country) {
      const availableCurrencies = Object.values(supportedCurrencies)
        .filter(currency => currency.supported_countries.includes(country.toUpperCase()));
      
      return NextResponse.json({ currencies: availableCurrencies });
    }

    return NextResponse.json({ currencies: Object.values(supportedCurrencies) });

  } catch (error) {
    console.error('❌ Error fetching currencies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    );
  }
}
