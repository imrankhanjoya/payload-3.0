import { isAdmin } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import type { CollectionConfig } from 'payload'
export const Experience: CollectionConfig = {
  slug: 'experiences',
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
      name: 'startdate',
      label: 'Start date',
      type: 'date',
    },

    {
      name: 'description',
      label: 'Experience',
      type: 'richText',
      required: true,
    },

    {
      name: 'infuencer',
      type: 'relationship',
      relationTo: 'users',
      // access: {
      //   update: () => true,
      // },
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
          data.infuencer = req.user.id
          return data
        }
      },
    ],
  },
}
