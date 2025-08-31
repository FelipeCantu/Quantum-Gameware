// src/sanity/schemas/product.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Price (USD)',
      type: 'number',
      validation: (Rule) => Rule.required().positive()
    }),
    defineField({
      name: 'originalPrice',
      title: 'Original Price (if on sale)',
      type: 'number',
      validation: (Rule) => Rule.positive().min(0)
    }),
    defineField({
      name: 'image',
      title: 'Product Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'images',
      title: 'Additional Images',
      type: 'array',
      of: [{ type: 'image' }]
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'brand',
      title: 'Brand',
      type: 'reference',
      to: [{ type: 'brand' }],
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }]
    }),
    defineField({
      name: 'compatibility',
      title: 'Compatibility',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'PC', value: 'pc' },
          { title: 'PlayStation 5', value: 'ps5' },
          { title: 'PlayStation 4', value: 'ps4' },
          { title: 'Xbox Series X/S', value: 'xbox-series' },
          { title: 'Xbox One', value: 'xbox-one' },
          { title: 'Nintendo Switch', value: 'switch' },
          { title: 'Mobile', value: 'mobile' }
        ]
      }
    }),
    defineField({
      name: 'inStock',
      title: 'In Stock',
      type: 'boolean',
      initialValue: true
    }),
    defineField({
      name: 'isFeatured',
      title: 'Featured Product',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'isNew',
      title: 'New Product',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule) => Rule.min(0).max(5)
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'category.name'
    }
  }
})