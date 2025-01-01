import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
// import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { addDataAndFileToRequest } from '@payloadcms/next/utilities'

export const Participants: CollectionConfig = {
  slug: 'participants',
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  // admin: {
  //   hidden: isAdmin ? true : false,
  // },
  fields: [
    {
      name: 'username',
      type: 'text',
    },
    {
      name: 'userbio',
      type: 'text',
    },
    {
      name: 'campaignId',
      type: 'text',
    },
    {
      name: 'userId',
      type: 'text',
    },
    {
      name: 'status',
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

        const result = await req.payload.create({collection: 'participants',data,})

        return Response.json(
          {
            message: `Data successfully added!`,
            result: result,
          },
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
  ],
}
