// src/app/api/test-payments/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

interface TestResult {
    service: string;
    status: 'success' | 'error' | 'warning';
    message: string;
    details?: any;
}

export async function GET() {
    const results: TestResult[] = [];

    try {
        console.log('🧪 Starting payment systems test...');

        // Test 1: Environment Variables
        console.log('📋 Testing environment variables...');
        const envTest = {
            stripe: {
                publishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
                secretKey: !!process.env.STRIPE_SECRET_KEY,
                webhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
            },
            paypal: {
                clientId: !!process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                clientSecret: !!process.env.PAYPAL_CLIENT_SECRET,
            },
            square: {
                applicationId: !!process.env.SQUARE_APPLICATION_ID,
                accessToken: !!process.env.SQUARE_ACCESS_TOKEN,
                environment: process.env.SQUARE_ENVIRONMENT,
            },
            encryption: {
                paymentKey: !!process.env.PAYMENT_ENCRYPTION_KEY,
                keyLength: process.env.PAYMENT_ENCRYPTION_KEY?.length || 0,
            },
            database: {
                mongoUri: !!process.env.MONGODB_URI,
                jwtSecret: !!process.env.JWT_SECRET,
            }
        };

        results.push({
            service: 'Environment Variables',
            status: 'success',
            message: 'Environment variables loaded',
            details: envTest
        });

        // Test 2: Stripe Connection
        console.log('💳 Testing Stripe connection...');
        if (process.env.STRIPE_SECRET_KEY) {
            try {
                const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
                    apiVersion: '2024-06-20',
                });

                // Test Stripe API with a simple call
                const account = await stripe.accounts.retrieve();

                results.push({
                    service: 'Stripe',
                    status: 'success',
                    message: 'Stripe API connection successful',
                    details: {
                        accountId: account.id,
                        country: account.country,
                        currency: account.default_currency,
                        chargesEnabled: account.charges_enabled,
                    }
                });
            } catch (stripeError) {
                results.push({
                    service: 'Stripe',
                    status: 'error',
                    message: 'Stripe API connection failed',
                    details: stripeError instanceof Error ? stripeError.message : 'Unknown error'
                });
            }
        } else {
            results.push({
                service: 'Stripe',
                status: 'error',
                message: 'Stripe secret key not found',
            });
        }

        // Test 3: PayPal Connection (Basic validation)
        console.log('💰 Testing PayPal configuration...');
        if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
            try {
                // Test PayPal by making a basic request to their API
                const paypalAuth = Buffer.from(
                    `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
                ).toString('base64');

                const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${paypalAuth}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'grant_type=client_credentials',
                });

                if (response.ok) {
                    const data = await response.json();
                    results.push({
                        service: 'PayPal',
                        status: 'success',
                        message: 'PayPal API connection successful',
                        details: {
                            tokenType: data.token_type,
                            scope: data.scope,
                            appId: data.app_id,
                        }
                    });
                } else {
                    results.push({
                        service: 'PayPal',
                        status: 'error',
                        message: 'PayPal authentication failed',
                        details: `HTTP ${response.status}`
                    });
                }
            } catch (paypalError) {
                results.push({
                    service: 'PayPal',
                    status: 'error',
                    message: 'PayPal API connection failed',
                    details: paypalError instanceof Error ? paypalError.message : 'Unknown error'
                });
            }
        } else {
            results.push({
                service: 'PayPal',
                status: 'warning',
                message: 'PayPal credentials not configured',
            });
        }

        // Test 4: Square Connection
        console.log('🟨 Testing Square connection...');
        if (process.env.SQUARE_APPLICATION_ID && process.env.SQUARE_ACCESS_TOKEN) {
            try {
                const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/locations', {
                    headers: {
                        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
                        'Square-Version': '2024-08-21',
                        'Content-Type': 'application/json',
                    },
                });

                if (squareResponse.ok) {
                    const squareData = await squareResponse.json();
                    results.push({
                        service: 'Square',
                        status: 'success',
                        message: 'Square API connection successful',
                        details: {
                            locationsCount: squareData.locations?.length || 0,
                            locations: squareData.locations?.map((loc: any) => ({
                                id: loc.id,
                                name: loc.name,
                                status: loc.status,
                            })) || []
                        }
                    });
                } else {
                    const errorData = await squareResponse.json();
                    results.push({
                        service: 'Square',
                        status: 'error',
                        message: 'Square API connection failed',
                        details: errorData
                    });
                }
            } catch (squareError) {
                results.push({
                    service: 'Square',
                    status: 'error',
                    message: 'Square API connection failed',
                    details: squareError instanceof Error ? squareError.message : 'Unknown error'
                });
            }
        } else {
            results.push({
                service: 'Square',
                status: 'warning',
                message: 'Square credentials not configured',
            });
        }

        // Test 5: Database Connection
        console.log('🗄️ Testing database connection...');
        try {
            const { connectDB, getConnectionStatus } = await import('@/lib/mongodb');
            await connectDB();

            results.push({
                service: 'Database',
                status: 'success',
                message: 'MongoDB connection successful',
                details: {
                    status: getConnectionStatus(),
                    uri: process.env.MONGODB_URI?.substring(0, 30) + '...',
                }
            });
        } catch (dbError) {
            results.push({
                service: 'Database',
                status: 'error',
                message: 'MongoDB connection failed',
                details: dbError instanceof Error ? dbError.message : 'Unknown error'
            });
        }

        // Test 6: Sanity CMS
        console.log('📄 Testing Sanity CMS connection...');
        try {
            const { client } = await import('@/sanity/lib/client');
            const productCount = await client.fetch('count(*[_type == "product"])')

            results.push({
                service: 'Sanity CMS',
                status: 'success',
                message: 'Sanity CMS connection successful',
                details: {
                    productCount,
                    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
                }
            });
        } catch (sanityError) {
            results.push({
                service: 'Sanity CMS',
                status: 'error',
                message: 'Sanity CMS connection failed',
                details: sanityError instanceof Error ? sanityError.message : 'Unknown error'
            });
        }

        // Test 7: Encryption Key Validation
        console.log('🔐 Testing encryption key...');
        if (process.env.PAYMENT_ENCRYPTION_KEY) {
            const keyLength = process.env.PAYMENT_ENCRYPTION_KEY.length;
            const isHex = /^[0-9a-fA-F]+$/.test(process.env.PAYMENT_ENCRYPTION_KEY);

            if (keyLength === 64 && isHex) {
                results.push({
                    service: 'Encryption Key',
                    status: 'success',
                    message: 'Encryption key is valid (32 bytes hex)',
                });
            } else {
                results.push({
                    service: 'Encryption Key',
                    status: 'error',
                    message: `Encryption key invalid: ${keyLength} chars, hex: ${isHex}`,
                });
            }
        } else {
            results.push({
                service: 'Encryption Key',
                status: 'error',
                message: 'Encryption key not set',
            });
        }

        // Generate Summary
        const summary = {
            total: results.length,
            success: results.filter(r => r.status === 'success').length,
            errors: results.filter(r => r.status === 'error').length,
            warnings: results.filter(r => r.status === 'warning').length,
        };

        console.log('✅ Payment systems test completed');

        return NextResponse.json({
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV,
            summary,
            results,
            recommendations: generateRecommendations(results),
        });

    } catch (error) {
        console.error('❌ Test suite failed:', error);
        return NextResponse.json({
            timestamp: new Date().toISOString(),
            error: 'Test suite failed',
            message: error instanceof Error ? error.message : 'Unknown error',
        }, { status: 500 });
    }
}

function generateRecommendations(results: TestResult[]): string[] {
    const recommendations: string[] = [];

    results.forEach(result => {
        if (result.status === 'error') {
            switch (result.service) {
                case 'Stripe':
                    recommendations.push('Fix Stripe API credentials or check network connectivity');
                    break;
                case 'PayPal':
                    recommendations.push('Verify PayPal client ID and secret are correct');
                    break;
                case 'Square':
                    recommendations.push('Check Square application ID and access token');
                    break;
                case 'Database':
                    recommendations.push('Verify MongoDB URI and network access');
                    break;
                case 'Encryption Key':
                    recommendations.push('Generate a proper 32-byte hex encryption key');
                    break;
            }
        }
    });

    if (recommendations.length === 0) {
        recommendations.push('All systems are operational! 🎉');
    }

    return recommendations;
}

