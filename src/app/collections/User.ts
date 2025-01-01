import type { CollectionConfig } from 'payload'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAdmin } from '@/access/isAdmin'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import { addDataAndFileToRequest } from '@payloadcms/next/utilities'

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
      name: 'oniontoken',
      type: 'text',
      required: false,
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
        { label: 'Agency', value: 'agency' },
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
      path: '/:add-request',
      method: 'post',
      handler: async (req: any) => {
        const data = await req?.json()
        await addDataAndFileToRequest(req)
        console.log('🚀 Brij 90 ~  file: ApprovalRequest.ts:30 ~  handler: ~  data:', data)
        const result = await req.payload.create({ collection: 'users', data })
        data.userid = result.id
        data.infuencer = result.id
        const resultval = await req.payload.create({ collection: 'influencers', data })
        return Response.json(
          { message: `Data successfully added!`, result: result, resultval },
          {
            headers: {
              'Access-Control-Allow-Origin': '*', // Adjust the origin as needed
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type',
            },
          },
        )
      },
    },
    {
      path: '/oauth:oniontoken',
      method: 'get',
      handler: async (req: any) => {
        const payload = await getPayloadHMR({ config: configPromise })

        const userCollection = 'users' // Replace with your auth-enabled collection slug
        // const oniontoken = 'avi@gmail.com'

        const { oniontoken } = req.routeParams
        const cleanData = oniontoken.trim()
        const userDocs = await payload.find({
          collection: userCollection,
          where: { oniontoken: { equals: cleanData } },
        })

        if (userDocs.totalDocs === 0) {
          return Response.json({ error: 'User not found.', oniontoken, userDocs }) // res.status(400).json({ error: 'User not found.' })
        }

        const user = userDocs.docs[0]

        const fieldsToSign = {
          email: user.email,
          id: user.id,
          collection: userCollection,
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
