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
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
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
        handler: async ({ data }) => {
          const { file } = data
          try {
            // Upload the file to ImageKit
            const result = await imagekit.upload({
              file: file.path, // Path to the file
              fileName: file.filename, // Optional custom file name
              folder: 'payload_media', // Optional folder in ImageKit
            })

            // Return metadata for the uploaded file
            return {
              url: result.url,
              fileName: result.name,
              mimeType: file.mimetype,
            }
          } catch (err) {
            console.error('ImageKit Upload Error:', err)
            throw new Error('File upload to ImageKit failed.')
          }
        },
        mimeTypes: ['image/*'], // Restrict to image uploads
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