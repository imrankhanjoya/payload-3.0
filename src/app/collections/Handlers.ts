import { isAdmin } from '@/access/isAdmin'
import { isAdminOrInfluencer } from '@/access/isAdminOrInfluencer'
import type { CollectionConfig } from 'payload'
export const Handlers: CollectionConfig = {
  slug: 'handlers',
  access: {
    create: isAdminOrInfluencer,
    update: isAdminOrInfluencer,
    read: isAdminOrInfluencer,
    delete: isAdmin,
  },

  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },
    {
      name: 'site',
      label: 'Socail Media Site',
      type: 'select',
      options: [
        { label: 'Facebook', value: 'facebook' },
        { label: 'Twitter', value: 'twitter' },
        { label: 'Instagram', value: 'instagram' },
        { label: 'TikTok', value: 'tiktok' },
      ],
      required: true,
    },
    {
      name: 'url',
      label: 'Social media URL',
      type: 'text',
    },
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      // access: {
      //   update: () => false,
      // },
      admin: {
        // readOnly: true,
        position: 'sidebar',
        condition: (data) => !!data?.createdBy,
      },
    },
    {
      name: 'infuencer',
      label: 'Select User',
      type: 'relationship',
      relationTo: 'users',
      access: {
        update: () => true,
      },
      admin: {
        // readOnly: true,
        position: 'sidebar',
        // condition: (data) => !!data?.createdBy,
      },
    },
  ],

  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (req.user) {
          //  data.createdBy = req.user.id
          return data
        }
      },
    ],
  },
}
