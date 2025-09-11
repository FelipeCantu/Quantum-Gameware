// src/sanity/schemaTypes/category.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Category Name',
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
      name: 'icon',
      title: 'Icon (Emoji)',
      type: 'string',
      description: 'Single emoji character to represent this category'
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'List of key features for this category'
    }),
    defineField({
      name: 'popularBrands',
      title: 'Popular Brands',
      type: 'array',
      of: [{ 
        type: 'reference',
        to: [{ type: 'brand' }]
      }],
      description: 'Popular brands in this category'
    }),
    defineField({
      name: 'priceRange',
      title: 'Price Range',
      type: 'object',
      fields: [
        {
          name: 'min',
          title: 'Minimum Price',
          type: 'number',
          validation: (Rule) => Rule.required().min(0)
        },
        {
          name: 'max',
          title: 'Maximum Price', 
          type: 'number',
          validation: (Rule) => Rule.required().min(0)
        }
      ]
    }),
    defineField({
      name: 'compatibility',
      title: 'Platform Compatibility',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'PC', value: 'PC' },
          { title: 'Mac', value: 'Mac' },
          { title: 'PlayStation', value: 'PlayStation' },
          { title: 'Xbox', value: 'Xbox' },
          { title: 'Nintendo Switch', value: 'Nintendo Switch' },
          { title: 'Mobile', value: 'Mobile' },
          { title: 'Universal', value: 'Universal' }
        ]
      }
    }),
    defineField({
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
      description: 'Lower numbers appear first'
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      subtitle: 'description'
    }
  }
})