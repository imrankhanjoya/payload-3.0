import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAdmin } from '@/access/isAdmin'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

export const User: CollectionConfig = {
  slug: 'users',
  auth: {
    useAPIKey: true,
  },
  access: {
    create: isAdmin,
    update: isAdminOrEditor,
    read: isAdminOrEditor,
    delete: isAdmin,
  },
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      saveToJWT: true,
      hasMany: false,
      access: {
        // create: isAdmin,
        // update: isAdminOrEditor,
      },
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Influencer', value: 'influencer' },
        // { label: 'User', value: 'user' },
      ],
      required: true,
      defaultValue: 'Admin',
    },
    {
      name: 'phone',
      type: 'text',
    },
  ],

  endpoints: [
    {
      path: '/oauth:email',
      method: 'get',
      handler: async (req:any) => {
        const payload = await getPayloadHMR({ config: configPromise })

        const userCollection = 'users' // Replace with your auth-enabled collection slug
        // const email = 'avi@gmail.com'
        const { email } = req.routeParams

        const userDocs = await payload.find({
          collection: userCollection,
          where: {
            email: {
              equals: email,
            },
          },
          depth: 0,
          limit: 1,
        })

        if (userDocs.totalDocs === 0) {
          return Response.json({ error: 'User not found.' }) // res.status(400).json({ error: 'User not found.' })
        }

        const user = userDocs.docs[0]
        // const collectionConfig = payload.collections[userCollection]?.config;

        // if (!collectionConfig) {
        //   return res.status(500).json({ error: 'Collection configuration not found.' });
        // }

        const fieldsToSign = {
          email: user.email,
          id: user.id,
          collection: 'users',
        }

        const token = jwt.sign(fieldsToSign, payload.secret, {
          expiresIn: 999999999,
        })

        cookies().set({
          name: `${payload.config.cookiePrefix}-token`,
          value: token,
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        })

        return Response.json(userDocs)
      },
    },
  ],
}
