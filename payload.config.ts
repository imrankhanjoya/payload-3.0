// import { Achivement } from './payload-types'
import path from 'path'
import { en } from 'payload/i18n/en'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { buildConfig, GlobalConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { Post } from '@/app/collections/Posts'
import { Campaign } from '@/app/collections/Campaigns'
import { Pages } from '@/app/collections/Pages'
import { User } from '@/app/collections/User'
import { Media } from '@/app/collections/Media'
import { Brands } from '@/app/collections/Brands'
import { Socialmedia } from '@/app/collections/Socialmedia'

// import ImageKit from 'imagekit'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { ApprovalRequest } from '@/app/collections/ApprovalRequest'
import { Influencer } from '@/app/collections/Influencer'
import { Experience } from '@/app/collections/Exprience'
import { Infuencerbrands } from '@/app/collections/Infuencerbrand'
import { Engagement } from '@/app/collections/Engagement'
import { Achivement } from '@/app/collections/Achivement'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Initialize ImageKit
// const imagekit = new ImageKit({
//   publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//   urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
// })

export default buildConfig({
  editor: lexicalEditor(),
  // collections: [Post, Campaign, User, Pages, Media],
  csrf: ['http://localhost:3000', 'https://onionpose.com', 'https://payload-3-0-pi.vercel.app'],
  collections: [
    Post,
    Brands,
    Socialmedia,
    Campaign,
    Influencer,
    Achivement,
    Experience,
    Infuencerbrands,
    Engagement,
    User,
    Pages,
    Media,
    ApprovalRequest,
  ],
  plugins: [
    vercelBlobStorage({
      enabled: true, // Optional, defaults to true
      // Specify which collections should use Vercel Blob
      collections: {
        media: true,
        'media-with-prefix': {
          prefix: 'my-prefix',
        },
      },
      // Token provided by Vercel once Blob storage is added to your Vercel project
      token: process.env.BLOB_READ_WRITE_TOKEN!,
    }),
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
      password: 'test',
      prefillOnly: true,
    },
    components: {
      // views: {
      //   customView: {
      //     Component: '/path/to/MyCustomView#MyCustomView',
      //     path: '/my-custom-view',
      //   }
      // },
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
          role: 'admin', // Ensure the role is provided
        },
      })
    }
  },
  sharp,
  // endpoints: [forceLoginEndpoint],
})
