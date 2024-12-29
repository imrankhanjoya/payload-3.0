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
      name: 'detail',
      label: 'Detail about engagement',
      type: 'textarea',
      required: true,
    },
    {
      name: 'screen',
      label: 'Engagement Screen',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'infuencer',
      label: 'Select User',
      type: 'relationship',
      relationTo: 'users', // Reference to the `users` collection
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
      },
      admin: {
        position: 'sidebar',
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
