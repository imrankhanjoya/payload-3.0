import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { createParticipants } from '../../access/createParticipants'
import { readParticipants } from '../../access/readParticipants'
// import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { addDataAndFileToRequest } from '@payloadcms/next/utilities'

export const Participants: CollectionConfig = {
  slug: 'participants',
  access: {
    read: readParticipants,
    create: createParticipants,
    update: isAdmin,
    delete: readParticipants,
  },
  // admin: {
  //   hidden: isAdmin ? true : false,
  // },
  fields: [
    
    {
      name: 'campaignId',
      label: 'Campaign',
      type: 'relationship',
      relationTo: 'campaigns',
      
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
   
    {
      name: 'status',
      access: {
        update: () => false,
      },
      type: 'select',
      options:[
        {value: 'participate',label: 'Participate'},
        {value: 'approved',label: 'Approved'},
        {value: 'rejected',label: 'Recejected'},
        {value: 'rejected',label: 'Recejected'},
      ],
      defaultValue:"participate",
      admin: {
        readOnly: true,
        // position: 'sidebar',
        // condition: (data) => !!data?.createdBy,
      },
    },
    {
      name: 'media',
      label: 'Capmpaign Media',
      type: 'array',
      maxRows: 3,
      fields: [
        {
          name: 'camfile',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'mediadescription',
          type: 'textarea',
          required: false,
        },
        {
          name: 'status',
          type: 'select',
          options:[{value: 'approved',label: 'Approved'},{value: 'rejected',label: 'Rejected'}],
        }
      ]
    },
    {
      name: 'socialdetail',
      label: 'Capmpaign Details Published',
      type: 'array',
      maxRows: 1,
      fields: [
        {
          name: 'camfile',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'mediadescription',
          type: 'textarea',
          required: false,
        },
        {
          name: 'status',
          type: 'select',
          options:[{value: 'approved',label: 'Approved'},{value: 'rejected',label: 'Rejected'}],
        }
      ]
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
  },
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
