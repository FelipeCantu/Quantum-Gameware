// src/app/api/payments/tax-rates/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state')?.toUpperCase();
    const country = searchParams.get('country')?.toUpperCase() || 'US';

    // Tax rates by state (US)
    const usTaxRates = {
      AL: { rate: 0.04, name: 'Alabama' },
      AK: { rate: 0.00, name: 'Alaska' },
      AZ: { rate: 0.056, name: 'Arizona' },
      AR: { rate: 0.065, name: 'Arkansas' },
      CA: { rate: 0.0725, name: 'California' },
      CO: { rate: 0.029, name: 'Colorado' },
      CT: { rate: 0.0635, name: 'Connecticut' },
      DE: { rate: 0.00, name: 'Delaware' },
      FL: { rate: 0.06, name: 'Florida' },
      GA: { rate: 0.04, name: 'Georgia' },
      HI: { rate: 0.04, name: 'Hawaii' },
      ID: { rate: 0.06, name: 'Idaho' },
      IL: { rate: 0.0625, name: 'Illinois' },
      IN: { rate: 0.07, name: 'Indiana' },
      IA: { rate: 0.06, name: 'Iowa' },
      KS: { rate: 0.065, name: 'Kansas' },
      KY: { rate: 0.06, name: 'Kentucky' },
      LA: { rate: 0.0445, name: 'Louisiana' },
      ME: { rate: 0.055, name: 'Maine' },
      MD: { rate: 0.06, name: 'Maryland' },
      MA: { rate: 0.0625, name: 'Massachusetts' },
      MI: { rate: 0.06, name: 'Michigan' },
      MN: { rate: 0.06875, name: 'Minnesota' },
      MS: { rate: 0.07, name: 'Mississippi' },
      MO: { rate: 0.04225, name: 'Missouri' },
      MT: { rate: 0.00, name: 'Montana' },
      NE: { rate: 0.055, name: 'Nebraska' },
      NV: { rate: 0.0685, name: 'Nevada' },
      NH: { rate: 0.00, name: 'New Hampshire' },
      NJ: { rate: 0.06625, name: 'New Jersey' },
      NM: { rate: 0.05125, name: 'New Mexico' },
      NY: { rate: 0.08, name: 'New York' },
      NC: { rate: 0.0475, name: 'North Carolina' },
      ND: { rate: 0.05, name: 'North Dakota' },
      OH: { rate: 0.0575, name: 'Ohio' },
      OK: { rate: 0.045, name: 'Oklahoma' },
      OR: { rate: 0.00, name: 'Oregon' },
      PA: { rate: 0.06, name: 'Pennsylvania' },
      RI: { rate: 0.07, name: 'Rhode Island' },
      SC: { rate: 0.06, name: 'South Carolina' },
      SD: { rate: 0.045, name: 'South Dakota' },
      TN: { rate: 0.07, name: 'Tennessee' },
      TX: { rate: 0.0625, name: 'Texas' },
      UT: { rate: 0.0485, name: 'Utah' },
      VT: { rate: 0.06, name: 'Vermont' },
      VA: { rate: 0.053, name: 'Virginia' },
      WA: { rate: 0.065, name: 'Washington' },
      WV: { rate: 0.06, name: 'West Virginia' },
      WI: { rate: 0.05, name: 'Wisconsin' },
      WY: { rate: 0.04, name: 'Wyoming' }
    };

    if (country === 'US' && state) {
      const stateRate = usTaxRates[state];
      if (stateRate) {
        return NextResponse.json({
          country: 'US',
          state,
          tax_rate: stateRate.rate,
          state_name: stateRate.name
        });
      }
    }

    // Default rates by country
    const countryRates = {
      US: { rate: 0.08, name: 'United States' }, // Average rate
      CA: { rate: 0.13, name: 'Canada' }, // Average HST/GST+PST
      GB: { rate: 0.20, name: 'United Kingdom' }, // VAT
      DE: { rate: 0.19, name: 'Germany' }, // VAT
      FR: { rate: 0.20, name: 'France' }, // VAT
      AU: { rate: 0.10, name: 'Australia' }, // GST
    };

    const rate = countryRates[country] || { rate: 0.0, name: 'Unknown' };

    return NextResponse.json({
      country,
      tax_rate: rate.rate,
      country_name: rate.name
    });

  } catch (error) {
    console.error('❌ Error fetching tax rates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tax rates' },
      { status: 500 }
    );
  }
}