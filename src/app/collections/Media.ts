import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true, // Allow public access to media files
  },
  upload: {
    staticDir: path.join(dirname, 'media'),
    adminThumbnail: ({ doc }) => (doc?.url ? doc.url.toString() : null),
    mimeTypes: ['image/*'],
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'centre',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'centre',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined, // Retain aspect ratio
        position: 'centre',
      },
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => false,
      },
      admin: {
        readOnly: true,
        position: 'sidebar',
        condition: (data) => !!data?.createdBy,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (req.user) {
          // if (operation === 'create') {
          //   data.updatedBy = req.user.id
          //   data.createdBy = req.user.id
          // } else if (operation === 'update') {
          data.createdBy = req.user.id
          //}
          return data
        }
      },
    ],
    //   afterChange: [
    //     async ({ doc, req }) => {
    //       try {
    //         const filePath = path.join('media', doc.filename)
    //         const result = await imagekit.upload({
    //           file: filePath,
    //           fileName: doc.filename,
    //           folder: 'payload_media',
    //         })

    //         await req.payload.update({
    //           collection: 'media',
    //           id: doc.id,
    //           data: {
    //             url: result.url,
    //           },
    //         })

    //         return result
    //       } catch (err) {
    //         console.error('ImageKit Upload Error:', err)
    //         throw new Error('Image upload to ImageKit failed.')
    //       }
    //     },
    //   ],
  },
}
