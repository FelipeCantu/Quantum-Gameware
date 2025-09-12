// src/sanity/lib/client.ts
import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // Set useCdn to false in production for faster updates
  // or use conditional logic based on environment
  useCdn: process.env.NODE_ENV === 'production' ? false : true,
  
  // Alternative: Use CDN but with shorter cache time
  // useCdn: true,
  // stega: {
  //   enabled: false,
  //   studioUrl: '/studio'
  // }
})

// Alternative client for real-time updates
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
})

// Use this function to get the appropriate client
export const getClient = (usePreview = false) => {
  return usePreview ? previewClient : client
}