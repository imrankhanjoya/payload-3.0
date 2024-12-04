import path from 'path'
import { en } from 'payload/i18n/en'
import {
  AlignFeature,
  BlockquoteFeature,
  BlocksFeature,
  BoldFeature,
  ChecklistFeature,
  HeadingFeature,
  IndentFeature,
  InlineCodeFeature,
  ItalicFeature,
  lexicalEditor,
  LinkFeature,
  OrderedListFeature,
  ParagraphFeature,
  RelationshipFeature,
  UnorderedListFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Post } from "@/app/collections/post"
import ImageKit from 'imagekit'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
})

export default buildConfig({
  editor: lexicalEditor(),
  collections: [
    {
      slug: 'users',
      auth: true,
      access: {
        delete: () => false,
        update: () => false,
      },
      fields: [{
        name: 'phone',
        type: 'text',
      }],
    },
    Post,
    {
      slug: 'pages',
      admin: {
        useAsTitle: 'title',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
        },
        {
          name: 'content',
          type: 'richText',
        },
      ],
    },
    {
      slug: 'media',
      upload: {
        staticDir: path.join(dirname, 'media'), // Local directory for fallback storage
        adminThumbnail: ({ doc }) => (doc?.url ? doc.url : ""), // Use ImageKit URL or fallback
        mimeTypes: ['image/*'], // Restrict uploads to images
        hooks: {
          afterChange: [
            async ({ data, req }) => {
              try {
                const filePath = path.join('media', data.filename) // Local file path
                const result = await imagekit.upload({
                  file: filePath, // File path to upload
                  fileName: data.filename, // ImageKit file name
                  folder: 'payload_media', // Folder in ImageKit
                })

                // Update the document in Payload with the ImageKit URL
                await req.payload.update({
                  collection: 'media',
                  id: data.id,
                  data: {
                    url: result.url,
                  },
                })

                return result
              } catch (err) {
                console.error('ImageKit Upload Error:', err)
                throw new Error('Image upload to ImageKit failed.')
              }
            },
          ],
        },
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
      ],
    },
  ],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  i18n: {
    supportedLanguages: { en },
  },
  admin: {
    autoLogin: {
      email: 'dev@payloadcms.com',
      password: 'test1',
      prefillOnly: true,
    },
  },
  async onInit(payload) {
    const existingUsers = await payload.find({
      collection: 'users',
      limit: 1,
    })

    if (existingUsers.docs.length === 0) {
      await payload.create({
        collection: 'users',
        data: {
          email: 'dev@payloadcms.com',
          password: 'test',
        },
      })
    }
  },
  sharp,
})
