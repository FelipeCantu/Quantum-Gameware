// src/app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

type WebhookPayload = {
  _type: string
  slug?: {
    current: string
  }
}

export async function POST(request: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      request,
      process.env.SANITY_REVALIDATE_SECRET
    )

    // Validate the webhook signature (recommended for production)
    if (!isValidSignature) {
      return new Response('Invalid signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    // Revalidate specific paths based on the content type
    switch (body._type) {
      case 'product':
        // Revalidate homepage and products page
        revalidatePath('/')
        revalidatePath('/products')
        
        // Revalidate specific product page if slug is available
        if (body.slug?.current) {
          revalidatePath(`/products/${body.slug.current}`)
        }
        
        // Revalidate product-related tags
        revalidateTag('products')
        revalidateTag('featured-products')
        break
        
      case 'category':
        // Revalidate categories and related pages
        revalidatePath('/categories')
        if (body.slug?.current) {
          revalidatePath(`/categories/${body.slug.current}`)
        }
        revalidateTag('categories')
        break
        
      case 'brand':
        // Revalidate brand-related content
        revalidateTag('brands')
        break
        
      default:
        // Revalidate homepage for any other content type
        revalidatePath('/')
    }

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
    })
  } catch (error) {
    console.error('Error revalidating:', error)
    return new Response('Error revalidating', { status: 500 })
  }
}