import { isAdmin } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrSelf'
import type { CollectionConfig } from 'payload'
export const Influencer: CollectionConfig = {
  slug: 'influencers',
  // access: {
  //   create: isAdminOrSelf,
  //   update: isAdminOrSelf,
  //   read: isAdminOrSelf,
  //   delete: isAdmin,
  // },

  fields: [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    },

    {
      name: 'userid',
      label: 'Userid',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      label: 'Bio',
      type: 'richText',
    },
    {
      name: 'website',
      label: 'Webstie',
      type: 'text',
    },

    {
      name: 'industry',
      label: 'Industry',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'Fashion', value: 'fashion' },
        { label: 'Health', value: 'health' },
        { label: 'Travel', value: 'travels' },
      ],
    },

    {
      name: 'country',
      label: 'Country',
      type: 'select',
      required: true,
      options: [
        { label: 'India', value: 'IN' },
        { label: 'Indonesia', value: 'ID' },
        { label: 'Thailand', value: 'TH' },
        { label: 'Singapore', value: 'SG' },
      ],
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'state',
      label: 'State',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
    },

    {
      name: 'turnaroundtime',
      label: 'Turn Around Time',
      type: 'text',
    },

    {
      name: 'image',
      label: 'Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
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
          //data.createdBy = req.user.id
          return data
        }
      },
    ],
  },
}
