import { isAdmin } from '@/access/isAdmin'
import { isAdminOrEditor } from '@/access/isAdminOrEditor'
import { isAdminOrInfluencer } from '@/access/isAdminOrInfluencer'
import type { CollectionConfig } from 'payload'
export const Infuencerbrands: CollectionConfig = {
  slug: 'infuencerbrands',
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
      name: 'brandlogo',
      type: 'upload',
      relationTo: 'media',
      required: false,
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
          data.createdBy = req.user.id
          return data
        }
      },
    ],
  },
}
