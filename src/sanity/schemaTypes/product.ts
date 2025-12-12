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
    }),
    defineField({
      name: 'categoryAttributes',
      title: 'Category-Specific Attributes',
      type: 'object',
      description: 'Dynamic attributes based on product category (e.g., screen size for monitors, DPI for mice)',
      fields: [
        // Gaming Keyboards
        { name: 'switchType', type: 'array', of: [{ type: 'string' }], title: 'Switch Type' },
        { name: 'keyboardSize', type: 'string', title: 'Keyboard Size' },
        { name: 'hotSwappable', type: 'boolean', title: 'Hot-Swappable' },

        // Gaming Mice
        { name: 'dpiRange', type: 'number', title: 'Max DPI' },
        { name: 'weight', type: 'number', title: 'Weight (g)' },
        { name: 'sensorType', type: 'string', title: 'Sensor Type' },
        { name: 'handOrientation', type: 'string', title: 'Hand Orientation' },

        // Gaming Headsets
        { name: 'driverSize', type: 'number', title: 'Driver Size (mm)' },
        { name: 'surroundSound', type: 'array', of: [{ type: 'string' }], title: 'Surround Sound' },
        { name: 'noiseCancellation', type: 'string', title: 'Noise Cancellation' },
        { name: 'micType', type: 'array', of: [{ type: 'string' }], title: 'Microphone Type' },

        // Gaming Monitors
        { name: 'screenSize', type: 'number', title: 'Screen Size (inches)' },
        { name: 'refreshRate', type: 'number', title: 'Refresh Rate (Hz)' },
        { name: 'resolution', type: 'array', of: [{ type: 'string' }], title: 'Resolution' },
        { name: 'panelType', type: 'array', of: [{ type: 'string' }], title: 'Panel Type' },
        { name: 'responseTime', type: 'string', title: 'Response Time' },
        { name: 'curved', type: 'boolean', title: 'Curved Screen' },
        { name: 'hdr', type: 'array', of: [{ type: 'string' }], title: 'HDR Support' },

        // Gaming Controllers
        { name: 'customizable', type: 'boolean', title: 'Customizable' },
        { name: 'controllerType', type: 'array', of: [{ type: 'string' }], title: 'Controller Type' },
        { name: 'backButtons', type: 'boolean', title: 'Back Buttons' },

        // Gaming Chairs
        { name: 'material', type: 'array', of: [{ type: 'string' }], title: 'Material' },
        { name: 'maxWeight', type: 'number', title: 'Max Weight Capacity (lbs)' },
        { name: 'lumbarSupport', type: 'string', title: 'Lumbar Support' },
        { name: 'armrestType', type: 'array', of: [{ type: 'string' }], title: 'Armrest Type' },
        { name: 'reclineAngle', type: 'string', title: 'Max Recline Angle' },

        // Mouse Pads
        { name: 'size', type: 'array', of: [{ type: 'string' }], title: 'Size' },
        { name: 'surfaceType', type: 'array', of: [{ type: 'string' }], title: 'Surface Type' },
        { name: 'thickness', type: 'number', title: 'Thickness (mm)' },
        { name: 'stitchedEdges', type: 'boolean', title: 'Stitched Edges' },

        // Gaming Microphones
        { name: 'polarPattern', type: 'array', of: [{ type: 'string' }], title: 'Polar Pattern' },
        { name: 'sampleRate', type: 'array', of: [{ type: 'string' }], title: 'Sample Rate' },
        { name: 'mountType', type: 'array', of: [{ type: 'string' }], title: 'Mount Type' },

        // Gaming Speakers
        { name: 'configuration', type: 'array', of: [{ type: 'string' }], title: 'Speaker Configuration' },
        { name: 'powerOutput', type: 'number', title: 'Total Power Output (W)' },
        { name: 'features', type: 'array', of: [{ type: 'string' }], title: 'Speaker Features' },

        // Common attributes across multiple categories
        { name: 'connection', type: 'array', of: [{ type: 'string' }], title: 'Connection Type' },
        { name: 'rgbLighting', type: 'boolean', title: 'RGB Lighting' },

        // Gaming Accessories
        { name: 'accessoryType', type: 'array', of: [{ type: 'string' }], title: 'Accessory Type' },
      ],
      options: {
        collapsible: true,
        collapsed: false,
      }
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