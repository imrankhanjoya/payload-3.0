import type { CollectionConfig } from 'payload'
import checkRoleAccess from '@/app/middleware/roleMiddleware'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: checkRoleAccess(['admin']),
    update: checkRoleAccess(['admin']),
    delete: checkRoleAccess(['admin']),
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
}
