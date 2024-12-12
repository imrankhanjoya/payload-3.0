import type { CollectionConfig } from 'payload'

export const Admin: CollectionConfig = {
  slug: 'admin',
  auth: true,
  access: {
    delete: () => true,
    update: () => true,
  },
  fields: [
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
