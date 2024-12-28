import { isAdmin } from '@/access/isAdmin'
import { isAdminOrInfluencer } from '@/access/isAdminOrInfluencer'
import type { CollectionConfig } from 'payload'
export const Achivement: CollectionConfig = {
  slug: 'achivements',
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
      name: 'date',
      label: 'Achivement date',
      type: 'date',
    },

    {
      name: 'description',
      label: 'Description',
      type: 'richText',
      required: true,
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
