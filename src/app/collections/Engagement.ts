import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAdminOrInfluencer } from '@/access/isAdminOrInfluencer'
import type { CollectionConfig } from 'payload'
export const Engagement: CollectionConfig = {
  slug: 'engagements',
  access: {
    create: isAdminOrInfluencer,
    update: isAdminOrInfluencer,
    read: isAdminOrInfluencer,
    delete: isAdminOrInfluencer,
  },

  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },

    {
      name: 'number',
      label: 'Numbers',
      type: 'number',
    },

    {
      name: 'description',
      label: 'Experience',
      type: 'richText',
      required: true,
    },

    {
      name: 'Infuencer',
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

    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      // access: {
      //   update: () => false,
      // },
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
          // if (req.user.role == 'influencer')
          data.createdBy = req.user.id
          return data
        }
      },
    ],
  },
}
