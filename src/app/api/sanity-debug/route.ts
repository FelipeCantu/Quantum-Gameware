// src/app/api/sanity-debug/route.ts
import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { validateSanityConfig } from '@/sanity/lib/queries'

export async function GET() {
  const configValidation = validateSanityConfig()
  
  // If config is invalid, return early
  if (!configValidation.isValid) {
    return NextResponse.json({
      status: 'error',
      message: 'Invalid Sanity configuration',
      errors: configValidation.errors,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }

  try {
    // Test 1: Basic connection
    console.log('Testing basic Sanity connection...')
    const ping = await client.fetch('*[_type == "product"] | length')
    
    // Test 2: Get document types
    console.log('Getting document types...')
    const documentTypes = await client.fetch(`
      array::unique(*[]._type) | order(@)
    `)
    
    // Test 3: Get sample documents
    console.log('Getting sample documents...')
    const sampleData = await Promise.all([
      client.fetch('*[_type == "product"][0...3]{_id, name, _type}'),
      client.fetch('*[_type == "category"][0...3]{_id, name, _type}'),
      client.fetch('*[_type == "brand"][0...3]{_id, name, _type}')
    ])
    
    // Test 4: Complex query (similar to your actual queries)
    console.log('Testing complex query...')
    const complexQuery = await client.fetch(`
      *[_type == "product"][0...2]{
        _id,
        name,
        "image": image.asset->url,
        "category": category->name,
        "brand": brand->name,
        "slug": slug.current
      }
    `)

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      environment: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
        nodeEnv: process.env.NODE_ENV
      },
      clientConfig: {
        useCdn: client.config().useCdn,
        apiHost: client.config().apiHost,
        dataset: client.config().dataset,
        projectId: client.config().projectId
      },
      tests: {
        connection: ping !== undefined,
        productCount: ping,
        documentTypes,
        sampleProducts: sampleData[0]?.length || 0,
        sampleCategories: sampleData[1]?.length || 0,
        sampleBrands: sampleData[2]?.length || 0,
        complexQueryResults: complexQuery?.length || 0
      },
      sampleData: {
        products: sampleData[0] || [],
        categories: sampleData[1] || [],
        brands: sampleData[2] || [],
        complexQuery: complexQuery || []
      }
    })
  } catch (error) {
    console.error('Sanity diagnostic failed:', error)
    
    let errorDetails: {
      name?: string;
      message: string;
      stack?: string;
      suggestion?: string;
    } = {
      message: 'Unknown error'
    }
    
    if (error instanceof Error) {
      errorDetails = {
        name: error.name,
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      }
      
      // Specific error analysis
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        errorDetails.suggestion = 'Check your project ID and dataset permissions in Sanity'
      } else if (error.message.includes('404') || error.message.includes('not found')) {
        errorDetails.suggestion = 'Verify your project ID and dataset exist'
      } else if (error.message.includes('CORS')) {
        errorDetails.suggestion = 'Add your domain to Sanity CORS origins'
      } else if (error.message.includes('fetch')) {
        errorDetails.suggestion = 'Check network connectivity'
      }
    }
    
    return NextResponse.json({
      status: 'error',
      timestamp: new Date().toISOString(),
      environment: {
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ? 'Set' : 'Missing',
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ? 'Set' : 'Missing',
        apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ? 'Set' : 'Missing',
        nodeEnv: process.env.NODE_ENV
      },
      error: errorDetails,
      configValidation
    }, { status: 500 })
  }
}