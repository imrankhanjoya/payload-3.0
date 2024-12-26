import { isAdmin } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import type { CollectionConfig } from 'payload'
export const Infuencerbrands: CollectionConfig = {
  slug: 'infuencerbrands',
  // access: {
  //   create: isAdminOrSelf,
  //   update: isAdminOrSelf,
  //   read: isAdminOrSelf,
  //   delete: isAdmin,
  // },

  fields: [
    {
      name: 'title',
      label: 'Title',
      type: 'text',
      required: true,
    },

    {
      name: 'url',
      label: 'Brand website',
      type: 'text',
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
  ],

  hooks: {
    beforeChange: [
      ({ req, operation, data }) => {
        if (req.user) {
          data.createdBy = req.user.id
          return data
        }
      },
    ],
  },
}
