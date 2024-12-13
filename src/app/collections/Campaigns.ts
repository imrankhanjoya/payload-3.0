import type { CollectionConfig } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'

export const Campaign: CollectionConfig = {
  slug: 'campaigns',
  access: {
    read: () => true, // Allow everyone to read
    update: () => true, // Allow everyone to update
    delete: checkRoleAccess(['admin']),
    create: checkRoleAccess(['admin', 'editor']),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
    },
    {
      name: 'Twitter',
      type: 'checkbox',
      label: 'Twitter',
      defaultValue: false,
    },
    {
      name: 'Facebook',
      type: 'checkbox',
      label: 'Facebook',
      defaultValue: false,
    },
    {
      name: 'Instagram',
      type: 'checkbox',
      label: 'Instagram',
      defaultValue: false,
    },
    {
      name: 'TikTok',
      type: 'checkbox',
      label: 'TikTok',
      defaultValue: false,
    },

    {
      name: 'campaignImage1',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'campaignImage2',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'campaignImage3',
      type: 'upload',
      relationTo: 'media',
      required: false,
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
  },
}
