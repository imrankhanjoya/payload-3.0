import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
// import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { addDataAndFileToRequest } from '@payloadcms/next/utilities'

export const ApprovalRequest: CollectionConfig = {
  slug: 'approval-request',
  access: {
    read: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  admin: {
    //hidden: isAdmin() ? true : false,
  },
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
        console.log('🚀 Brij  ~  file: ApprovalRequest.ts:30 ~  handler: ~  data:', data)

        const result = await req.payload.create({
          collection: 'approval-request',
          data,
        })

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
