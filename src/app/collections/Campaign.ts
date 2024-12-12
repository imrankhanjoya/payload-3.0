import type { CollectionConfig } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'

export const Campaign: CollectionConfig = {
  slug: 'campaign',
  access: {
    read: () => true, // Allow everyone to read
    update: () => true, // Allow everyone to update
    delete: checkRoleAccess(['admin']),
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
      name: 'Twitter', // required
      type: 'checkbox', // required
      label: 'Twitter',
      defaultValue: false,
    },
    {
      name: 'Facebook', // required
      type: 'checkbox', // required
      label: 'Facebook',
      defaultValue: false,
    },
    {
      name: 'Instagram', // required
      type: 'checkbox', // required
      label: 'Instagram',
      defaultValue: false,
    },
    {
      name: 'TikTok', // required
      type: 'checkbox', // required
      label: 'TikTok',
      defaultValue: false,
    },

    {
      name: 'campaignImage1', // required
      type: 'upload', // required
      relationTo: 'media', // required
      required: false,
    },
    {
      name: 'campaignImage2', // required
      type: 'upload', // required
      relationTo: 'media', // required
      required: false,
    },
    {
      name: 'campaignImage3', // required
      type: 'upload', // required
      relationTo: 'media', // required
      required: false,
    },
  ],
}
